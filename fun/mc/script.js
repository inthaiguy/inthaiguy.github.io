document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    container.style.height = "5000px";
  
    const blockImages = [
      "imgs/1.17DiamondOre.webp",
      "imgs/AncientDebris.webp",
      "imgs/AzaleaRoots.webp",
      "imgs/Block_of_Coal.webp",
      "imgs/BlockOfDiamondNew.webp",
      "imgs/BlockOfEmeraldNew.webp",
      "imgs/BlockOfGoldNew.webp",
      "imgs/BlockOfNetherite.webp",
      "imgs/BlockOfQuartzNew.webp",
      "imgs/CoalOreNew.webp",
      "imgs/Coarse_Dirt.webp",
      "imgs/Copper_Ore_New.webp",
      "imgs/CopperBlockJE1.webp",
      "imgs/Dirt.webp",
      "imgs/GrassNew.webp",
      "imgs/GrassPathNew.webp",
      "imgs/IronBlockNew.webp",
      "imgs/LapisLazuliBlockNew.webp",
      "imgs/MissingTextureBlock.webp",
      "imgs/Moss_Block.webp",
      "imgs/Mycelium.webp",
      "imgs/NetherGoldOreNew.webp",
      "imgs/NetherQuartzOreNew.webp",
      "imgs/NewFarmland.webp",
      "imgs/RedstoneBlockNew.webp",
      "imgs/RedstoneOreNew.webp",
      "imgs/StoneNew.webp",
      "imgs/UpdateBlock1.webp"
    ];
  
    let blocks = [];
    let blockCount = 0;
  
    function addBlock(imageSrc, bottomOffset = 0, zIndex = 1) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.className = "block";
      img.style.position = "absolute";
      img.style.left = "50%";
      img.style.bottom = `${bottomOffset}px`;
      img.style.transform = "translateX(-50%)";
      img.style.zIndex = zIndex; // Ensure stacking order
      container.appendChild(img);
      blocks.push(img);
    }
  
    function startStacking() {
      container.innerHTML = "";
      blocks = [];
      blockCount = 0;
      // Add initial block at the bottom of the page
      addBlock(blockImages[Math.floor(Math.random() * blockImages.length)], 0, 1);
      blockCount++;
    }
  
    function dropBlock() {
      if (blockCount >= 30) return;
  
      const newBlock = document.createElement("img");
      newBlock.src = blockImages[Math.floor(Math.random() * blockImages.length)];
      newBlock.className = "block";
      newBlock.style.position = "absolute";
      newBlock.style.left = "50%";
      newBlock.style.top = `-164px`;
      newBlock.style.transform = "translateX(-50%)";
      newBlock.style.zIndex = blockCount + 1;
      container.appendChild(newBlock);
  
      // Animate the block falling
      let topPosition = -164;
      const targetPosition = blockCount * 164;
      const fallInterval = setInterval(() => {
        topPosition += 10;
        newBlock.style.top = `${topPosition}px`;
        if (topPosition >= targetPosition) {
          clearInterval(fallInterval);
          newBlock.style.bottom = `${targetPosition}px`;
          newBlock.style.top = "";
          blocks.push(newBlock);
          blockCount++;
        }
      }, 20);
    }
  
    startStacking();
    setInterval(dropBlock, 2000);
  });
  