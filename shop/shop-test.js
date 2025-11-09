document.addEventListener("DOMContentLoaded", function () {
  const coinsDisplay = document.querySelector(".coins-amount");
  const petSprite = document.getElementById("pet-sprite");
  const priceDisplay = document.querySelector(".price-text");
  const buyButton = document.querySelector(".buy-btn");
  const leftButton = document.querySelector(".arrow.left");
  const rightButton = document.querySelector(".arrow.right");
  const notEnoughMsg = document.createElement("div");

  notEnoughMsg.classList.add("not-enough-float");
  const petDisplay = document.querySelector(".pet-display"); // 或 ".pet-preview"
  petDisplay.style.position = "relative"; // 确保父容器是定位基准
  petDisplay.appendChild(notEnoughMsg);

  let coins = 500;

  // 🧩 所有宠物定义
  const items = [
    {
      name: "Naked Cat",
      sprite: "cat-idle.png",
      frames: 10,
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
      frames: 20,
      price: 800,
      owned: false,
      equipped: false
    }
  ];

  let currentIndex = 0;

  function updateCoins() {
    coinsDisplay.textContent = `$ ${coins.toLocaleString()}`;
  }

  // ⚙️ 自动动画计算 + 居中显示
  function setSpriteAnimation(item) {
    const img = new Image();
    img.src = `../assets/${item.sprite}`;
    img.onload = () => {
      const totalWidth = img.width;
      const frameWidth = totalWidth / item.frames;
      const totalHeight = img.height;

      // 1️⃣ 修复初始显示尺寸问题
      petSprite.style.display = "block";
      petSprite.style.width = `${frameWidth}px`;
      petSprite.style.height = `${totalHeight}px`;
      petSprite.style.backgroundImage = `url("../assets/${item.sprite}")`;
      petSprite.style.backgroundSize = `${totalWidth}px ${totalHeight}px`;
      petSprite.style.backgroundRepeat = "no-repeat";
      petSprite.style.backgroundPosition = "0 0";
      petSprite.style.imageRendering = "pixelated";

      // 2️⃣ 防止 keyframe 累积
      const animName = `${item.name.toLowerCase().replace(/\s+/g, "")}Anim`;
      const old = document.getElementById(animName);
      if (old) old.remove();

      const styleTag = document.createElement("style");
      styleTag.id = animName;
      styleTag.textContent = `
        @keyframes ${animName} {
          from { background-position-x: 0; }
          to { background-position-x: -${totalWidth}px; }
        }
      `;
      document.head.appendChild(styleTag);

      // 3️⃣ 重新应用动画
      petSprite.style.animation = `${animName} ${item.frames / 10}s steps(${item.frames}) infinite`;
    };
    console.log("Loading sprite:", `../assets/${item.sprite}`);
    console.log("Image size:", img.width, img.height);

  }

  // 🛒 更新显示
  function updateItemDisplay() {
    const item = items[currentIndex];
    setSpriteAnimation(item);

    if (item.owned) {
      priceDisplay.textContent = "Owned";
      buyButton.textContent = item.equipped ? "Equipped" : "Equip";
      buyButton.disabled = item.equipped;
    } else {
      priceDisplay.textContent = `$ ${item.price}`;
      buyButton.textContent = "Buy";
      buyButton.disabled = false;
    }
  }

  // ← → 切换
  leftButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateItemDisplay();
  });

  rightButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateItemDisplay();
  });

  // 💸 购买逻辑
  buyButton.addEventListener("click", () => {
    const item = items[currentIndex];
    if (item.owned) {
      items.forEach(i => (i.equipped = false));
      item.equipped = true;
      updateItemDisplay();
      return;
    }

    if (coins >= item.price) {
      coins -= item.price;
      item.owned = true;
      item.equipped = true;
      items.forEach(i => (i.equipped = i === item));
      updateCoins();
      updateItemDisplay();
    } else {
      notEnoughMsg.textContent = "Not Enough Coins!";
      notEnoughMsg.style.animation = "floatUp 1s ease forwards";
      setTimeout(() => (notEnoughMsg.style.animation = ""), 1000);
    }
  });

  updateCoins();
  updateItemDisplay();
});
