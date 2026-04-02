$contratosActive = Import-Csv "public\Contratos Active.csv" -Delimiter ';'
$contratosAta = Import-Csv "public\Contratos Ata Sistemas.csv" -Delimiter ';'
$receitasActive = Import-Csv "public\Receitas Active.csv" -Delimiter ';'
$receitasAta = Import-Csv "public\Receitas AtaSistemas.csv" -Delimiter ';'

$cnpjs = @{}
foreach ($c in $contratosActive) {
    $d = ($c.'Apelido Cliente' -replace '[^0-9]','')
    if ($d.Length -ge 14) { $cnpjs[$d.Substring(0,14)] = $c.'Nome Cliente' }
    elseif ($d.Length -eq 11) { $cnpjs[$d] = $c.'Nome Cliente' }
}
foreach ($c in $contratosAta) {
    $d = ($c.'Apelido Cliente' -replace '[^0-9]','')
    if ($d.Length -ge 14) { $cnpjs[$d.Substring(0,14)] = $c.'Nome Cliente' }
    elseif ($d.Length -eq 11) { $cnpjs[$d] = $c.'Nome Cliente' }
}

Write-Host "CNPJs encontrados nos contratos: $($cnpjs.Count)"
Write-Host ""
Write-Host "============================================"
Write-Host "  RECEITAS ACTIVE SEM CONTRATO CORRESPONDENTE"
Write-Host "============================================"

$semActive = @()
foreach ($r in $receitasActive) {
    $d = ($r.Cliente -replace '[^0-9]','')
    $doc = $null
    if ($d.Length -ge 14) { $doc = $d.Substring(0,14) }
    elseif ($d.Length -eq 11) { $doc = $d }
    
    if ($doc -and -not $cnpjs.ContainsKey($doc)) {
        $linha = "  DOC: $doc | CLIENTE: $($r.Cliente.Trim()) | STATUS: $($r.Status) | VALOR: $($r.'Vlr Titulo')"
        if ($semActive -notcontains $r.Cliente.Trim()) {
            Write-Host $linha
            $semActive += $r.Cliente.Trim()
        }
    }
}
Write-Host ""
Write-Host ">>> Total clientes unicos Active SEM contrato: $($semActive.Count)"

Write-Host ""
Write-Host "============================================"
Write-Host "  RECEITAS ATA SEM CONTRATO CORRESPONDENTE"
Write-Host "============================================"

$semAta = @()
foreach ($r in $receitasAta) {
    $d = ($r.Cliente -replace '[^0-9]','')
    $doc = $null
    if ($d.Length -ge 14) { $doc = $d.Substring(0,14) }
    elseif ($d.Length -eq 11) { $doc = $d }
    
    if ($doc -and -not $cnpjs.ContainsKey($doc)) {
        $linha = "  DOC: $doc | CLIENTE: $($r.Cliente.Trim()) | STATUS: $($r.Status) | VALOR: $($r.'Vlr Titulo')"
        if ($semAta -notcontains $r.Cliente.Trim()) {
            Write-Host $linha
            $semAta += $r.Cliente.Trim()
        }
    }
}
Write-Host ""
Write-Host ">>> Total clientes unicos Ata SEM contrato: $($semAta.Count)"
Write-Host ""
Write-Host ">>> TOTAL GERAL SEM CONTRATO: $($semActive.Count + $semAta.Count)"
