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
    const keywordMenu = document.getElementById("dropdown-menu-keyword");  // 關鍵字下拉選單列表
    
    keywords.forEach(keyword => {
        if (keyword) {
            const li = document.createElement("li");
            li.textContent = keyword;
            // li.classList.add("dropdown-item");
            li.addEventListener('click', () => {
                document.getElementById("dropdown-selected-keyword").textContent = keyword;
                closeAllDropdowns();
            });
            keywordMenu.appendChild(li);
        }
    });

    // 填充類型選項
    const typeMenu = document.getElementById("dropdown-menu-type");  // 類型下拉選單列表
    
    // 先添加「全部」選項作為第一個選項
    const allOption = document.createElement("li");
    allOption.textContent = "全部";
    allOption.classList.add("selected");  // 設為已選中
    allOption.dataset.value = "allOption";  // 自定義數據屬性
    typeMenu.appendChild(allOption);

    // 點擊「全部」選項後的操作
    allOption.addEventListener("click", () => {
        const dropdownSelected = document.getElementById("dropdown-selected-type");
        dropdownSelected.textContent = "全部";  // 設為顯示「全部」
        closeAllDropdowns();
    });

    types.forEach(type => {
        if (type) {
            const li = document.createElement("li");
            li.textContent = type;
            // li.classList.add("dropdown-item");
            li.addEventListener('click', () => {
                document.getElementById("dropdown-selected-type").textContent = type;
                closeAllDropdowns();
            });
            typeMenu.appendChild(li);
        }
    });

    // 填充類型選項，多選框
    const attributeSelect = document.getElementById("attribute");  // 屬性
    
    attributeSelect.innerHTML = "";
    attributes.forEach(attr => {
        if (attr) {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = attr;
            checkbox.name = "attribute";
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(attr));
            attributeSelect.appendChild(label);
        }
    });

    // 將 Set 轉換為數組，並進行排序
    const sortedTags = Array.from(tags).sort();
    // 填充標籤選項
    const tagMenu = document.getElementById("dropdown-menu-tag");  // 標籤下拉選單列表

    sortedTags.forEach(tag => {
        if (tag) {
            const li = document.createElement("li");
            li.textContent = tag;
            // li.classList.add("dropdown-item");
            li.addEventListener('click', () => {
                document.getElementById("dropdown-selected-tag").textContent = tag;
                closeAllDropdowns();
            });
            tagMenu.appendChild(li);
        }
    });

    // 填充卡包選項
    const setMenu = document.getElementById("dropdown-menu-set");  // 卡包下拉選單列表

    Object.keys(sets).forEach(category => {
        // 創建一個不可點擊的分類標籤
        const categoryLabel = document.createElement("li");
        categoryLabel.textContent = category;  // 顯示類別名稱（如「起始牌組」）
        categoryLabel.classList.add("category-label");  // 標識這是分類標籤
        // categoryLabel.classList.add("dropdown-item");
        categoryLabel.style.fontWeight = "bold";  // 可以加粗字體來區分分類標籤
        categoryLabel.style.cursor = "default";  // 設置為不可點擊（顯示默認的光標）
        categoryLabel.style.pointerEvents = "none";  // 禁用滑鼠事件

        setMenu.appendChild(categoryLabel);

        // 在每個分類下面，添加一個新的 ul 來顯示該類別下的選項
        const subMenu = document.createElement("ul");
        subMenu.classList.add("sub-menu");  // 用於區分子選單

        // 添加該分類下的所有卡包選項
        sets[category].forEach(set => {
            const setOption = document.createElement("li");
            setOption.textContent = set;
            // setOption.classList.add("dropdown-item");
            setOption.addEventListener('click', () => {
                // 當選擇某個卡包時更新顯示框
                document.getElementById("dropdown-selected-set").textContent = set;
                closeAllDropdowns();
            });
            subMenu.appendChild(setOption);
        });

        setMenu.appendChild(subMenu);  // 把該類別的選項（subMenu）添加到分類下面
    });
}

// 清除篩選條件按鈕
const clearFiltersBtn = document.getElementById("clear-filters");  // 清除篩選條件按鈕

clearFiltersBtn.addEventListener("click", () => {
    // 檢查是否有任何篩選條件被選擇
    const isAnyFilterSelected = document.getElementById("dropdown-selected-keyword").textContent !== "" ||
                                document.getElementById("dropdown-selected-type").textContent !== "全部" ||
                                Array.from(document.querySelectorAll('input[name="attribute"]')).some(checkbox => checkbox.checked) ||
                                document.getElementById("dropdown-selected-tag").textContent !== "" ||
                                document.getElementById("dropdown-selected-set").textContent !== "";

    if (isAnyFilterSelected) {
        document.getElementById("dropdown-selected-keyword").textContent = "";  // 清除關鍵字
        document.getElementById("dropdown-selected-type").textContent = "全部";  // 恢復預設值
        document.querySelectorAll('input[name="attribute"]').forEach(checkbox => {  // 清除屬性框
            checkbox.checked = false;  // 取消選中所有 checkbox
        });
        document.getElementById("dropdown-selected-tag").textContent = "";  // 清除標籤
        document.getElementById("dropdown-selected-set").textContent = "";  // 清除卡包

        displayCards(cardsData);  // 顯示所有卡牌
    }
});

// 設置下拉選單點擊事件
const dropdowns = document.querySelectorAll('.dropdown');  // 所有下拉選單
dropdowns.forEach(dropdown => {
    const dropdownSelected = dropdown.querySelector('.dropdown-selected');  // 下拉選單顯示框
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');  // 下拉選單列表
    const menuItems = dropdownMenu.querySelectorAll('li');  // 選項

    const arrow = dropdownSelected.querySelector('.dropdown-arrow');  // 下拉選單箭頭
    const clearButton = dropdownSelected.querySelector('.clear-button');  // 下拉選單關閉按鈕
    
    // 點擊下拉選單顯示框
    dropdownSelected.addEventListener('click', (e) => {
        e.stopPropagation();

        if (dropdown.classList.contains('open')) {
            dropdown.classList.remove('open');
            arrow.textContent = "▼";
        } else {
            closeAllDropdowns();
            dropdown.classList.add('open');
            arrow.textContent = "▲";
        }
    });

    // 點擊選項後更新顯示框並關閉下拉選單
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownSelected.textContent = item.textContent;  // 更新顯示的選項
            closeAllDropdowns();
            arrow.textContent = "▼";
            clearButton.style.display = "inline";
        });
    });

    // 點擊下拉選單關閉按鈕
    clearButton.addEventListener("click", () => {
        dropdownSelected.textContent = "";
        arrow.textContent = "▼";
        clearButton.style.display = "none";
        dropdownSelected.classList.remove("has-selection");
        closeAllDropdowns();
    });
});

// 點擊其他地方關閉所有下拉選單
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {  // 如果點擊的不是下拉選單區域
        closeAllDropdowns();
    }
});

// 關閉所有下拉選單
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('open');  // 隱藏下拉選單
        const arrow = dropdown.querySelector('.dropdown-arrow');
        arrow.textContent = "▼";
    });
}
