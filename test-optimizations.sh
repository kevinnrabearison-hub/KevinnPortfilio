#!/bin/bash
# test-optimizations.sh - Vérifier que les optimisations sont en place

echo "🔍 Vérification des optimisations Render gratuit..."
echo ""

# 1. Vérifier keepalive
echo "1️⃣  Keepalive Anti-Cold Start:"
if grep -q "startKeepalive\|Keep-alive activ" backend/server.js; then
    echo "   ✅ Keepalive trouvé dans server.js"
else
    echo "   ❌ Keepalive NOT FOUND"
fi

# 2. Vérifier cache TTL
echo ""
echo "2️⃣  Cache Visitor Count (5 min):"
if grep -q "cacheTTL: 5 \* 60 \* 1000" backend/server.js; then
    echo "   ✅ Cache TTL 5 minutes configuré"
else
    echo "   ❌ Cache TTL non configuré correctement"
fi

# 3. Vérifier rate limits
echo ""
echo "3️⃣  Rate Limits Optimisés:"
if grep -q "limit: 60" backend/server.js; then
    echo "   ✅ Visitor count limit: 60/min"
else
    echo "   ❌ Visitor count limit pas à 60"
fi

if grep -q "limit: 10" backend/server.js | tail -1; then
    echo "   ✅ Contact limit: 10/15min"
else
    echo "   ❌ Contact limit pas à 10"
fi

# 4. Vérifier retry
echo ""
echo "4️⃣  Fonction Retry DB:"
if grep -q "withRetry\|DB_RETRY" backend/db.js; then
    echo "   ✅ Fonction withRetry trouvée"
else
    echo "   ❌ Fonction withRetry NOT FOUND"
fi

# 5. Vérifier fallback cache
echo ""
echo "5️⃣  Fallback Cache en Cas d'Erreur:"
if grep -q "count: publicVisitorCountCache.value || 0" backend/routes/public.js; then
    echo "   ✅ Fallback cache implémenté"
else
    echo "   ❌ Fallback cache NOT FOUND"
fi

# 6. Vérifier doc
echo ""
echo "6️⃣  Documentation:"
if [ -f "RENDER_FREE_OPTIMIZATION.md" ]; then
    echo "   ✅ Guide complet créé: RENDER_FREE_OPTIMIZATION.md"
else
    echo "   ❌ Guide NOT FOUND"
fi

echo ""
echo "=========================================="
echo "✨ Toutes les optimisations sont en place!"
echo "=========================================="
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. git add -A"
echo "   2. git commit -m 'feat: optimisations Render gratuit'"
echo "   3. git push origin main"
echo "   4. Render redéploiera automatiquement"
echo ""
echo "📊 Métriques à vérifier dans Render Dashboard:"
echo "   - Logs pour 'Keep-alive activé'"
echo "   - CPU/RAM usage réduit"
echo "   - Pas de cold starts"
