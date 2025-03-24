// 等待文檔加載完成
document.addEventListener("DOMContentLoaded", function() {
  
  const dropdowns = document.querySelectorAll('.dropdown');

  // 遍历所有下拉菜单，处理每一个下拉菜单的点击事件
dropdowns.forEach(dropdown => {
    const dropdownSelected = dropdown.querySelector('.dropdown-selected');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const menuItems = dropdownMenu.querySelectorAll('li');

    // 点击下拉框切换显示
    dropdownSelected.addEventListener('click', (e) => {
        e.stopPropagation();  // 防止点击下拉框时事件冒泡到文档上，关闭其他下拉框
        dropdown.classList.toggle('open');
    });

    // 选择选项
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownSelected.textContent = item.textContent;
            dropdown.classList.remove('open');
        });
    });
});

// 点击外部关闭下拉菜单
document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});

  // 使用 fetch 從 JSON 檔案載入資料
  fetch("cards.json")
    .then(response => response.json())  // 解析 JSON 資料
    .then(data => {
        cardsData = data;
        generateFilterOptions();  // 生成篩選選項
        displayCards(cardsData);  // 顯示所有卡牌
    })
    .catch(error => {
        console.error("Error loading the card data:", error);
    });

  // 根據 JSON 資料生成篩選選項
  function generateFilterOptions() {
    const keywords = new Set();
    const types = new Set();
    const attributes = new Set();
    const tags = new Set();
    const sets = {
      "起始牌組": new Set(),
      "補充包": new Set(),
      "其他": new Set()
    };

    // 這是用來儲存卡牌名稱的集合
    cardsData.forEach(card => {
      keywords.add(card.name);
      types.add(card.type);
      attributes.add(card.attribute);
        if (card.tag) {
          card.tag.split(" / ").forEach(tag => tags.add(tag));
        }
        if (card.set) {
          if (card.set.includes("起始牌組")) {
            sets["起始牌組"].add(card.set);
          }else if (card.set.includes("補充包")) {
            sets["補充包"].add(card.set);
          }else if (card.set === "配件" || card.set === "PR卡"){
            sets["其他"].add(card.set);
          }
        }
    });

    // 填充關鍵字選項
    const keywordMenu = document.getElementById("dropdown-menu-keyword");
    keywords.forEach(keyword => {
      if (keyword) {
        const li = document.createElement("li");
          li.textContent = keyword;
          li.classList.add("dropdown-item");
          li.addEventListener("click", () => {
            document.getElementById("dropdown-selected-keyword").textContent = keyword;
          });
          keywordMenu.appendChild(li);
      }
    });


    
  }
  
}
