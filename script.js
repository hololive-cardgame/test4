// 取得所有的篩選選單元素
const dropdowns = document.querySelectorAll('.dropdown');  // 所有下拉選單
const dropdownSelected = dropdown.querySelector('.dropdown-selected');  // 下拉選單顯示框
const dropdownMenu = dropdown.querySelector('.dropdown-menu');  // 下拉選單列表
const menuItems = dropdownMenu.querySelectorAll('li');  // 選項

const keywordMenu = document.getElementById("dropdown-menu-keyword");  // 關鍵字下拉選單列表

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
keywords.forEach(keyword => {
    if (keyword) {
        const li = document.createElement("li");
        li.textContent = keyword;
        // li.classList.add("dropdown-item");
        li.addEventListener("click", () => {
        document.getElementById("dropdown-selected-keyword").textContent = keyword;
        filterCards();
        });
        keywordMenu.appendChild(li);
    }
});

// 設置下拉選單點擊事件
// 監聽所有下拉選單
dropdowns.forEach(dropdown => {
    // 點擊下拉選單顯示框
    dropdownSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');  // 切換開啟或關閉下拉選單
    });

    // 點擊選項後更新顯示區域並關閉選單
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownSelected.textContent = item.textContent;  // 更新顯示的選項
            dropdown.classList.remove('open');  // 隱藏選單
        });
    });
});

// 點擊其他地方關閉所有下拉選單
document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
    // 如果點擊的不是下拉選單或其子元素，則關閉下拉選單
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});
