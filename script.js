document.addEventListener("DOMContentLoaded", function() {
  // 遍历所有下拉菜单，处理每一个下拉菜单的点击事件
  const dropdowns = document.querySelectorAll('.dropdown'); // 获取所有dropdown元素
  dropdowns.forEach(dropdown => {
    const dropdownSelected = dropdown.querySelector('.dropdown-selected');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const menuItems = dropdownMenu.querySelectorAll('li');

    // 点击下拉框切换显示
    dropdownSelected.addEventListener('click', (e) => {
      e.stopPropagation();  // 防止点击下拉框时事件冒泡到文档上，关闭其他下拉框
      dropdown.classList.toggle('open');  // 切换当前下拉菜单的显示状态
    });

    // 选择选项
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        dropdownSelected.textContent = item.textContent;
        dropdown.classList.remove('open');  // 选择后关闭当前下拉框
      });
    });
  });

  // 点击外部关闭下拉菜单
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      // 如果点击的不是下拉菜单区域，关闭它
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });

  // 使用 fetch 从 JSON 文件加载数据
  fetch("cards.json")
    .then(response => response.json())  // 解析 JSON 数据
    .then(data => {
        cardsData = data;
        generateFilterOptions();  // 生成筛选选项
        displayCards(cardsData);  // 显示所有卡牌
    })
    .catch(error => {
        console.error("Error loading the card data:", error);
    });

  // 根据 JSON 数据生成筛选选项
  function generateFilterOptions() {
    const keywords = new Set();
    const types = new Set();
    const attributes = new Set();
    const tags = new Set();
    const sets = {
      "起始牌组": new Set(),
      "补充包": new Set(),
      "其他": new Set()
    };

    // 这是用来储存卡牌名称的集合
    cardsData.forEach(card => {
      keywords.add(card.name);
      types.add(card.type);
      attributes.add(card.attribute);
      if (card.tag) {
        card.tag.split(" / ").forEach(tag => tags.add(tag));
      }
      if (card.set) {
        if (card.set.includes("起始牌组")) {
          sets["起始牌组"].add(card.set);
        } else if (card.set.includes("补充包")) {
          sets["补充包"].add(card.set);
        } else if (card.set === "配件" || card.set === "PR卡") {
          sets["其他"].add(card.set);
        }
      }
    });

    // 填充关键字选项
    const keywordMenu = document.getElementById("dropdown-menu-keyword");
    keywords.forEach(keyword => {
      if (keyword) {
        const li = document.createElement("li");
        li.textContent = keyword;
        li.classList.add("dropdown-item");
        li.addEventListener("click", () => {
          document.getElementById("dropdown-selected-keyword").textContent = keyword;
          dropdown.classList.remove('open');  // 选择后关闭当前下拉框
        });
        keywordMenu.appendChild(li);
      }
    });
  }
});
