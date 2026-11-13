<#
.SYNOPSIS
    Pure PowerShell TcpListener HTTP Server for BillTrack
.DESCRIPTION
    Zero-dependency, reliable local web server that runs without requiring URL ACLs or admin rights.
    Serves files from the current directory at http://localhost:8080 (or custom port).
#>

param(
    [int]$Port = 8000
)

$basePath = $PSScriptRoot
$ip = [System.Net.IPAddress]::Loopback
$listener = [System.Net.Sockets.TcpListener]::new($ip, $Port)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  BillTrack Local Server Started!" -ForegroundColor Cyan
    Write-Host "  URL: http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host "  Serving: $basePath" -ForegroundColor Gray
    Write-Host "  Press Ctrl+C to terminate." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    while ($true) {
        if ($listener.Pending()) {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII)
            
            $requestLine = $reader.ReadLine()
            if (-not [string]::IsNullOrWhiteSpace($requestLine)) {
                $parts = $requestLine -split ' '
                $rawPath = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
                $cleanPath = $rawPath.Split('?')[0].TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($cleanPath)) {
                    $cleanPath = "index.html"
                }

                $filePath = [System.IO.Path]::Combine($basePath, $cleanPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar))

                if ([System.IO.File]::Exists($filePath)) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $contentType = switch ($ext) {
                        ".html" { "text/html; charset=utf-8" }
                        ".css"  { "text/css; charset=utf-8" }
                        ".js"   { "application/javascript; charset=utf-8" }
                        ".json" { "application/json; charset=utf-8" }
                        ".svg"  { "image/svg+xml" }
                        default { "application/octet-stream" }
                    }

                    $header = "HTTP/1.1 200 OK`r`n" +
                              "Content-Type: $contentType`r`n" +
                              "Content-Length: $($bytes.Length)`r`n" +
                              "Connection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $cleanPath")
                    $header = "HTTP/1.1 404 Not Found`r`n" +
                              "Content-Type: text/plain`r`n" +
                              "Content-Length: $($body.Length)`r`n" +
                              "Connection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($body, 0, $body.Length)
                }
            }

            $stream.Flush()
            $client.Close()
        } else {
            Start-Sleep -Milliseconds 50
        }
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Yellow
} finally {
    $listener.Stop()
}
