// Магазин и скины

function updateCurrency() {
    const coinsSpan = document.getElementById("coinsAmount");
    const crystalsSpan = document.getElementById("crystalsAmount");
    const shopCoins = document.getElementById("shopCoins");
    const shopCrystals = document.getElementById("shopCrystals");
    
    if (coinsSpan) coinsSpan.innerText = playerStats.coins;
    if (crystalsSpan) crystalsSpan.innerText = playerStats.crystals;
    if (shopCoins) shopCoins.innerText = playerStats.coins;
    if (shopCrystals) shopCrystals.innerText = playerStats.crystals;
}

function addCoins(amount) {
    playerStats.coins += amount;
    updateCurrency();
}

function addCrystals(amount) {
    playerStats.crystals += amount;
    updateCurrency();
}

function applySkinToCell(cell) {
    if (!cell) return;
    cell.classList.remove("skin-neon", "skin-gold", "skin-ice", "skin-fire");
    cell.classList.add(`skin-${playerStats.activeSkin}`);
}

function updateAllSkins() {
    document.querySelectorAll(".cell").forEach(cell => applySkinToCell(cell));
}

function buySkin(skinId) {
    let skin = SKINS.find(s => s.id === skinId);
    if (!skin || playerStats.ownedSkins.includes(skinId)) return false;
    if ((skin.priceCoins > 0 && playerStats.coins < skin.priceCoins) || 
        (skin.priceCrystals > 0 && playerStats.crystals < skin.priceCrystals)) return false;
    if (skin.priceCoins > 0) playerStats.coins -= skin.priceCoins;
    if (skin.priceCrystals > 0) playerStats.crystals -= skin.priceCrystals;
    playerStats.ownedSkins.push(skinId);
    updateCurrency();
    return true;
}

function setActiveSkin(skinId) {
    if (!playerStats.ownedSkins.includes(skinId)) return false;
    playerStats.activeSkin = skinId;
    updateAllSkins();
    return true;
}

function buyItem(itemId) {
    let item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return false;
    if ((item.priceCoins > 0 && playerStats.coins < item.priceCoins) || 
        (item.priceCrystals > 0 && playerStats.crystals < item.priceCrystals)) return false;
    if (item.priceCoins > 0) playerStats.coins -= item.priceCoins;
    if (item.priceCrystals > 0) playerStats.crystals -= item.priceCrystals;
    if (item.effect?.crystalsGain) addCrystals(item.effect.crystalsGain);
    if (item.effect?.coinsGain) addCoins(item.effect.coinsGain);
    playerStats.ownedItems[itemId] = (playerStats.ownedItems[itemId] || 0) + 1;
    updateCurrency();
    return true;
}

function applyActiveBonuses() {
    activeDoubleScore = playerStats.consumablesUsed.double_score;
    activeStartCombo = playerStats.consumablesUsed.combo_boost ? 2 : 1;
}

function openShop() {
    let modal = document.getElementById("shopModal");
    let list = document.getElementById("shopItemsList");
    if (!list) return;
    
    list.innerHTML = "";
    let title = document.createElement("div");
    title.style.cssText = "font-size:1rem;margin:10px 0;color:gold;font-family:'Orbitron'";
    title.innerHTML = "🎨 СКИНЫ ДЛЯ КЛЕТОК";
    list.appendChild(title);
    
    SKINS.forEach(skin => {
        let owned = playerStats.ownedSkins.includes(skin.id);
        let active = playerStats.activeSkin === skin.id;
        let div = document.createElement("div");
        div.className = "shop-item";
        let price = skin.default ? "БЕСПЛАТНО" : (skin.priceCoins ? `💰 ${skin.priceCoins}` : `💎 ${skin.priceCrystals}`);
        let btn = "";
        if (!owned && !skin.default) btn = `<button class="shop-buy-btn skin-buy" data-skin="${skin.id}">КУПИТЬ</button>`;
        else if (owned && !active) btn = `<button class="shop-buy-btn skin-set" data-skin="${skin.id}">НАДЕТЬ</button>`;
        else if (active) btn = `<div class="skin-current">✅ НАДЕТО</div>`;
        div.innerHTML = `<div style="display:flex;gap:10px"><div class="skin-preview ${skin.id}">${skin.icon}</div><div><b>${skin.name}</b></div></div><div style="display:flex;gap:8px"><span style="color:gold">${price}</span>${btn}</div>`;
        list.appendChild(div);
    });
    
    let title2 = document.createElement("div");
    title2.style.cssText = "font-size:1rem;margin:20px 0 10px;color:gold;font-family:'Orbitron'";
    title2.innerHTML = "🛍️ УЛУЧШЕНИЯ";
    list.appendChild(title2);
    
    SHOP_ITEMS.forEach(item => {
        let count = playerStats.ownedItems[item.id] || 0;
        let div = document.createElement("div");
        div.className = "shop-item";
        let price = (item.priceCoins ? `💰 ${item.priceCoins}` : "") + (item.priceCrystals ? ` 💎 ${item.priceCrystals}` : "");
        let stack = count > 0 ? `<span style="background:#ff6600;padding:2px 8px;border-radius:15px;margin-left:5px;">x${count}</span>` : "";
        div.innerHTML = `<div><b>${item.name} ${stack}</b><div style="font-size:0.65rem">${item.desc}</div></div><div style="display:flex;gap:8px"><span style="color:gold">${price}</span><button class="shop-buy-btn item-buy" data-item="${item.id}">КУПИТЬ</button></div>`;
        list.appendChild(div);
    });
    
    document.querySelectorAll(".skin-buy").forEach(btn => btn.onclick = () => { if (buySkin(btn.dataset.skin)) { openShop(); alert("✅ Скин куплен!"); } else alert("❌ Не хватает ресурсов!"); });
    document.querySelectorAll(".skin-set").forEach(btn => btn.onclick = () => { setActiveSkin(btn.dataset.skin); openShop(); alert("✅ Скин надет!"); });
    document.querySelectorAll(".item-buy").forEach(btn => btn.onclick = () => buyItem(btn.dataset.item));
    
    if (modal) modal.classList.add("active");
    updateCurrency();
}

function closeShop() {
    const modal = document.getElementById("shopModal");
    if (modal) modal.classList.remove("active");
}