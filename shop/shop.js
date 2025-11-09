// ==================== SHOP SYSTEM (Auto Sprite Animation) ====================

document.addEventListener("DOMContentLoaded", function () {
  // --- 元素选择 ---
  const petSprite = document.getElementById("pet-sprite");
  const itemName = document.querySelector(".item-name");
  const priceText = document.querySelector(".price-text");
  const buyButton = document.querySelector(".buy-btn");
  const equipButton = document.querySelector(".equip-btn");
  const leftButton = document.querySelector(".arrow.left");
  const rightButton = document.querySelector(".arrow.right");
  const coinsDisplay = document.querySelector(".coins-amount");
  const notEnough = document.querySelector(".not-enough-float");

  // --- 初始金币 ---
  let coins = 500;

  // --- 商品数据 ---
  const items = [
    {
      name: "Cat",
      sprite: "cat-idle.png",
      frames: 6,
      price: 0,
      owned: true,
      equipped: true
    },
    {
      name: "Witch",
      sprite: "witch-idle.png",
      frames: 19,
      price: 500,
      owned: false,
      equipped: false
    },
    {
      name: "Vampire",
      sprite: "vampire-idle.png",
      frames: 12,
      price: 800,
      owned: false,
      equipped: false
    }
  ];

  let currentIndex = 0;

  // ==================== 动态创建动画 ====================
  function setSpriteAnimation(item) {
    const img = new Image();
    img.src = `../assets/${item.sprite}`;
    img.onload = () => {
      const totalWidth = img.width;       // 整张图宽度
      const frameWidth = totalWidth / item.frames; // 每帧宽度
      const totalHeight = img.height;

      // 设置显示框
      petSprite.style.width = `${frameWidth}px`;
      petSprite.style.height = `${totalHeight}px`;
      petSprite.style.backgroundImage = `url("../assets/${item.sprite}")`;
      petSprite.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
      petSprite.style.backgroundRepeat = "no-repeat";
      petSprite.style.backgroundPosition = "0 0";

      // 自动生成唯一动画名
      const animName = `${item.name.toLowerCase()}Anim`;

      // 动态创建 keyframes
      const styleTag = document.createElement("style");
      styleTag.textContent = `
        @keyframes ${animName} {
          from { background-position-x: 0; }
          to { background-position-x: -${totalWidth}px; }
        }
      `;
      document.head.appendChild(styleTag);

      // 应用动画
      petSprite.style.animation = `${animName} ${item.frames / 10}s steps(${item.frames}) infinite`;
    };
  }

  // ==================== 更新商店 ====================
  function updateShop() {
    const item = items[currentIndex];
    itemName.textContent = item.name;

    // 更新价格显示
    if (item.owned) {
      priceText.textContent = "Owned";
    } else {
      priceText.textContent = `${item.price} Coins`;
    }

    // 更新按钮状态
    if (item.owned && item.equipped) {
      equipButton.textContent = "Equipped";
      equipButton.disabled = true;
      buyButton.textContent = "Owned";
      buyButton.disabled = true;
    } else if (item.owned && !item.equipped) {
      equipButton.textContent = "Equip";
      equipButton.disabled = false;
      buyButton.textContent = "Owned";
      buyButton.disabled = true;
    } else {
      equipButton.textContent = "Equip";
      equipButton.disabled = true;
      buyButton.textContent = "Buy";
      buyButton.disabled = false;
    }

    // 更新金币显示
    coinsDisplay.textContent = `💰 ${coins}`;

    // 设置动画
    setSpriteAnimation(item);
  }

  // ==================== 切换宠物 ====================
  leftButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateShop();
  });

  rightButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateShop();
  });

  // ==================== 购买逻辑 ====================
  buyButton.addEventListener("click", () => {
    const item = items[currentIndex];
    if (item.owned) return;
    if (coins >= item.price) {
      coins -= item.price;
      item.owned = true;
      updateShop();
    } else {
      triggerNotEnoughAnimation();
    }
  });

  // ==================== 装备逻辑 ====================
  equipButton.addEventListener("click", () => {
    const item = items[currentIndex];
    if (item.owned) {
      items.forEach(i => (i.equipped = false));
      item.equipped = true;
      updateShop();
    }
  });

  // ==================== Not Enough Coins 动画 ========
