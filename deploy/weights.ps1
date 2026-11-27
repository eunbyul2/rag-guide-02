param([int]$Stable = 90, [int]$Canary = 10)
$act = @{ type = "forward"; forwardConfig = @{ targetGroups = @(
          @{ serviceName = "rag-stable"; servicePort = "80"; weight = $Stable },
          @{ serviceName = "rag-canary"; servicePort = "80"; weight = $Canary }) } }
$json = ConvertTo-Json $act -Depth 6 -Compress
kubectl annotate ingress rag --overwrite "alb.ingress.kubernetes.io/actions.weighted=$json"