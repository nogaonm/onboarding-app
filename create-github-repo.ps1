# Script para criar repositório no GitHub
# Execute este script no PowerShell

$token = "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"
$repoName = "onboarding-app"
$description = "Sistema de onboarding personalizado para prestadores de serviço - Social Media, Copywriting, Tráfego Pago, Design e Assistência Virtual"

# Criar o repositório
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$body = @{
    name = $repoName
    description = $description
    private = $false
    auto_init = $false
} | ConvertTo-Json

try {
    Write-Host "Criando repositório no GitHub..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "✓ Repositório criado com sucesso!" -ForegroundColor Green
    Write-Host "URL: $($response.html_url)" -ForegroundColor Cyan
    Write-Host ""
    
    # Adicionar remote e fazer push
    Write-Host "Configurando remote e fazendo push..." -ForegroundColor Yellow
    git remote add origin $response.clone_url
    git branch -M main
    git push -u origin main
    
    Write-Host "✓ Código enviado para o GitHub!" -ForegroundColor Green
    Write-Host "Acesse: $($response.html_url)" -ForegroundColor Cyan
    
} catch {
    Write-Host "✗ Erro ao criar repositório:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternativa: Crie manualmente em https://github.com/new" -ForegroundColor Yellow
    Write-Host "Depois execute:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/SEU_USUARIO/onboarding-app.git" -ForegroundColor Cyan
    Write-Host "  git branch -M main" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
}
