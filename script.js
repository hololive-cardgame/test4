// 取得所有的篩選選單元素
const setSelect = document.getElementById("set");  // 卡包
const clearFiltersBtn = document.getElementById("clearFilters");  // 清除篩選條件按鈕
const cardContainer = document.getElementById("cardContainer");  // 卡牌展示區

let cardsData = [];  // 所有卡牌資料
let filteredCards = [];  // 篩選後的卡牌資料
let currentPage = 0;  // 初始頁面是第一頁
const cardsPerPage = 30;  // 設置每頁顯示的卡牌數量
let currentIndex = -1;  // 當前顯示的卡牌索引

// 使用 fetch 從 JSON 檔案載入資料
fetch("cards.json")
  .then(response => response.json())  // 解析 JSON 資料
  .then(data => {
    cardsData = data;
    filteredCards = data;

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
  const blooms = new Set();
  const tags = new Set();
  const sets = {
    "起始牌組": new Set(),
    "補充包": new Set(),
    "其他": new Set()
  };

  // 儲存卡牌名稱的集合
  cardsData.forEach(card => {
    keywords.add(card.name);
    types.add(card.type);
    if (card.attribute) {
      card.attribute.split(" / ").forEach(attr => attributes.add(attr));
    }
    blooms.add(card.bloom);
    if (card.tag) {
        card.tag.split(" / ").forEach(tag => tags.add(tag));
    }
    if (card.set) {
      const cardSets = Array.isArray(card.set) ? card.set : [card.set];
      cardSets.forEach(setItem => {
        if (setItem.includes("起始牌組")) {
          const setName = setItem.replace("起始牌組","").replace(/[「」]/g,"").trim();
          sets["起始牌組"].add(setName);
        }else if (setItem.includes("補充包")) {
          const setName = setItem.replace("補充包","").replace(/[「」]/g,"").trim();
          sets["補充包"].add(setName);
        }else if (card.set === "スタートエールセット" || card.set === "PR卡"){
          sets["其他"].add(setItem);
        }
      });
    }
  });

  // 填充關鍵字選項
  keywords.forEach(keyword => {
    if (keyword) {
      const option = document.createElement("option");
      option.value = keyword;
      option.textContent = keyword;
      $("#keyword").append(option);
    }
  });

  // 初始化類型
  $("#type").select2({
    minimumResultsForSearch: Infinity,
    width: "100%"
  });
  // 監聽篩選條件變動，觸發篩選
  $("#type").on("select2:select", function() {
    filterCards();
  });
  // 填充類型選項
  const allOption = new Option("全部","allOption");
  $("#type").append(allOption);
  types.forEach(type => {
    if (type) {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      $("#type").append(option);
    }
  });
  // 觸發更新
  $("#type").trigger("change");

  // 填充屬性選項
  attributes.forEach(attribute => {
    if (attribute) {
      const option = document.createElement("option");
      option.value = attribute;
      option.textContent = attribute;
      $("#attribute").append(option);
    }
  });

  // 填充綻放等級選項
  blooms.forEach(bloom => {
    if (bloom) {
      const option = document.createElement("option");
      option.value = bloom;
      option.textContent = bloom;
      $("#bloom").append(option);
    }
  });

  // 將 Set 轉換為數組，並進行排序
  const sortedTags = Array.from(tags).sort();
  // 填充標籤選項
  sortedTags.forEach(tag => {
    if (tag) {
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = tag;
      $("#tag").append(option);
    }
  });

  // 卡包排序hSDxx、hBPxx
  function customSort(arr) {
    return arr.sort((a, b) => {
      const extractNumber = (set) => {
        const match = set.match(/h\w+(\d+)/);
        if (match) {
          return parseInt(match[1], 10);  // 返回數字
        }
        return Infinity; // 如果沒有匹配到名稱，放到最後面
      };

      const numberA = extractNumber(a);
      const numberB = extractNumber(b);

      return numberA - numberB;  // 按數字排序
    });
  }
  // 填充卡包選項
  Object.keys(sets).forEach(category => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = category;  // Set group label

    // 添加該分類下的所有卡包選項
    const sortedSets = customSort(Array.from(sets[category]));
    sortedSets.forEach(set => {
      const option = document.createElement("option");
      option.value = set;
      option.textContent = set;
      optgroup.appendChild(option);
    });

    // 把分組添加到 select 元素中
    setSelect.appendChild(optgroup);
  });
  // 設定預設為空值（選單本身保持空）
  setSelect.value = "";

  // 初始化 Select2
  $(document).ready(function() {
    let isInitialized = false;  // 確保初始化時不進行篩選
    
    // 初始化關鍵字、屬性、綻放等級、標籤、卡包
    $("#keyword, #attribute, #bloom, #tag, #set").select2({
      placeholder: "",
      minimumResultsForSearch: Infinity,
      width: "100%",
      tags: false,
      createSearchChoice: function(term, data) {
    return null;  // 禁止用戶手動輸入選項
  },
  dropdownAutoWidth: true,
  escapeMarkup: function (markup) { return markup; } 
    });
    
    // 設定初始值不觸發
    function setSelect2ValueWithoutChange(selector, value) {
      const Select2 = $.fn.select2.amd.require('select2/core');
      const $element = $(selector);
      const instance = $element.data('select2');

      if (instance) {
        instance.triggerChange = false;  // 禁用觸發
        $element.val(value).trigger('change');
        instance.triggerChange = true;  // 重啟觸發
      } else {
        $element.val(value).trigger('change', { triggerChange: false });
      }
    }

    // 初始化選項
    function initializeFilterOptions() {
      setSelect2ValueWithoutChange("#keyword", "");
      setSelect2ValueWithoutChange("#bloom", "");
      setSelect2ValueWithoutChange("#attribute", "");
      setSelect2ValueWithoutChange("#tag", "");
      setSelect2ValueWithoutChange("#set", "");
    }
    initializeFilterOptions();

    // 監聽篩選條件變動，觸發篩選
    $('#attribute').on('change', function() {
      if (isInitialized) {
        filterCards();
      }
    });
    $("#keyword, #attribute, #bloom, #tag, #set").on("select2:select", function() {
      if (isInitialized) filterCards();
    });

    // 監聽 Select2 的變更事件，當選擇框有值時顯示自定義的清除按鈕
    $("#keyword, #bloom, #tag, #set").on("select2:select", function() {
      $("#clear" + this.id.charAt(0).toUpperCase() + this.id.slice(1)).show();  // 顯示自定義清除按鈕
    });

    // 監聽 Select2 的清除事件，當選擇框清除選項時隱藏自定義的清除按鈕
    $("#keyword, #bloom, #tag, #set").on("select2:clear", function() {
      $("#clear" + this.id.charAt(0).toUpperCase() + this.id.slice(1)).hide();  // 隱藏自定義清除按鈕
    });

    // 當自定義的清除按鈕被點擊時，清除選擇框的值並手動關閉下拉選單
    $("#clearKeyword, #clearBloom, #clearTag, #clearSet").on("click", function() {
      var target = $(this).attr("id").replace("clear", "").toLowerCase();  // 提取ID
      $("#" + target).val("").trigger("change").select2("close");  // 清空選擇框的值並觸發更新、手動關閉下拉選單
      $(this).hide();  // 隱藏清除按鈕
      filterCards();
    });

    // 初始化清除按鈕狀態
    $("#keyword, #bloom, #tag, #set").each(function() {
      if ($(this).val() === "") {  // 當沒有選擇任何項目時，隱藏清除按鈕
        $("#clear" + this.id.charAt(0).toUpperCase() + this.id.slice(1)).hide();
      }
    });

    // 防止屬性下拉選單在取消選項時展開
    $('#attribute').on('select2:unselecting', function (e) {
      $(this).data('unselecting', true);
    }).on('select2:opening', function (e) {
      if ($(this).data('unselecting')) {
        $(this).removeData('unselecting');
        e.preventDefault();
      }
    });
    
    // 初始化完成，進行篩選
    isInitialized = true;
  });
}

// 清除篩選條件按鈕
clearFiltersBtn.addEventListener("click", () => {
  // 檢查是否有任何篩選條件被選擇
  const isAnyFilterSelected = $("#keyword").val() ||
                              $("#type").val() !== "allOption" ||
                              $("#bloom").val() ||
                              $("#attribute").val() ||
                              $("#tag").val() ||
                              $("#set").val();
  
  if (isAnyFilterSelected) {
    // 如果有篩選條件被選擇，則清除所有篩選條件
    $("#keyword, #attribute, #bloom, #tag, #set").val("").trigger("change");
    $("#type").val("allOption").trigger("change");

    // 初始化清除按鈕狀態
    $("#clearKeyword, #clearBloom, #clearTag, #clearSet").hide(); // 隱藏 "X"

    displayCards(cardsData);  // 顯示所有卡牌
  }
});

// 顯示卡牌
function displayCards(cards) {
  cardContainer.innerHTML = "";  // 清空現有卡牌

  // 計算當前頁面的開始和結束索引
  const startIndex = currentPage * cardsPerPage;
  const endIndex = Math.min(startIndex + cardsPerPage, cards.length);

  // 如果沒有卡牌，顯示提示訊息
  if (cards.length === 0) {
    cardContainer.innerHTML = '<p>沒有符合的資料</p>';
    return;
  }

  for (let i = startIndex; i < endIndex; i++) {
    const card = cards[i];
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
      <img src="${card.image}" alt="${card.name}">
    `;

    // 點擊卡牌展示詳細資訊
    cardElement.addEventListener("click", () => {
      currentIndex = i;
      showPopup(card, currentIndex);
    });
    cardContainer.appendChild(cardElement);
  }
  // 生成分頁
  generatePaginationControls(cards.length);
}

// 分頁控制
function generatePaginationControls(totalCards) {
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";  // 清空現有分頁

  const maxPageButtons = 5;  // 最多顯示的頁碼數量（不包括省略號）

  // 計算顯示頁碼的範圍
  let startPage, endPage;

  if (totalPages <= maxPageButtons) {
    // 如果頁碼總數小於最大頁碼顯示數量，顯示所有頁碼
    startPage = 0;
    endPage = totalPages;
  } else {
    // 如果頁碼總數大於最大頁碼顯示數量，顯示目前頁碼附近的頁碼
    if (currentPage < maxPageButtons - 2) {
      // 當前頁處於前面，顯示前幾頁+省略號
      startPage = 0;
      endPage = maxPageButtons;
    } else if (currentPage > totalPages - maxPageButtons + 2) {
      // 當前頁處於後面，顯示後幾頁+省略號
      startPage = totalPages - maxPageButtons;
      endPage = totalPages;
    } else {
      // 中間部分，顯示前後各兩頁，並加上省略號
      startPage = currentPage - 2;
      endPage = currentPage + 3;
    }
  }

  // 分頁左箭頭
  const leftArrow = document.createElement("div");
  leftArrow.classList.add("pagination-arrow");
  leftArrow.innerHTML = `
    <svg width="40" height="40" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIosRoundedIcon">
      <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
    </svg>
  `;
  
  if (currentPage > 0) {
    leftArrow.addEventListener("click", () => {
      currentPage--;
      displayCards(filteredCards);  // 更新顯示的卡牌
      scrollToTop();
    });
  } else {
    leftArrow.classList.add("disabled");  // 添加禁用
  }
  paginationContainer.appendChild(leftArrow);
  
  // 如果沒有顯示第一頁和省略號，添加省略號
  if (startPage > 1) {
    const ellipsisButton = document.createElement("span");
    ellipsisButton.textContent = "...";
    paginationContainer.appendChild(ellipsisButton);
  }

  // 分頁按鈕
  for (let i = startPage; i < endPage; i++) {
    const pageButton = document.createElement("div");
    pageButton.textContent = i + 1;
    pageButton.classList.add("pagination-button");
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayCards(filteredCards);  // 點擊分頁按鈕時更新顯示的卡牌
      scrollToTop();
    });
    paginationContainer.appendChild(pageButton);
  }

  // 如果沒有顯示最後一頁和省略號，添加省略號
  if (endPage < totalPages) {
    const ellipsisButton = document.createElement("span");
    ellipsisButton.textContent = "...";
    paginationContainer.appendChild(ellipsisButton);
  }

  // 分頁右箭頭
  const rightArrow = document.createElement("div");
  rightArrow.classList.add("pagination-arrow");
  rightArrow.innerHTML = `
    <svg width="40" height="40" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIosRoundedIcon">
      <path d="M7.38 21.01c.49.49 1.28.49 1.77 0L17.46 12.7c.39-.39.39-1.02 0-1.41l-8.31-8.31c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"></path>
    </svg>
  `;
  
  if (currentPage < totalPages - 1) {
    rightArrow.addEventListener("click", () => {
      currentPage++;
      displayCards(filteredCards);  // 更新顯示的卡牌
      scrollToTop();
    });
  } else {
    rightArrow.classList.add("disabled");  // 添加禁用
  }
  paginationContainer.appendChild(rightArrow);  
}

// 根據篩選條件顯示卡牌
function filterCards() {
  // 獲取篩選條件
  const keyword = $("#keyword").val();  // 關鍵字
  const type = $("#type").val();  // 類型
  const bloom = $("#bloom").val(); // 綻放等級
  const selectedAttributes = $("#attribute").val() || [];  // 屬性
  const tag = $("#tag").val();  // 標籤
  const set = $("#set").val();  // 卡包
  
  filteredCards = cardsData.filter(card => {
    // 逐個條件篩選
    const matchesKeyword = keyword ? card.name.toLowerCase().includes(keyword.toLowerCase()) : true;  // 如果 keyword 不為空，則篩選符合關鍵字的卡牌
    const matchesType = type && type !== "allOption" ? card.type === type : true;  // 類型選擇框預設為 "allOption"，如果不為空則篩選
    const matchesBloom = bloom ? card.bloom && card.bloom.includes(bloom) : true;
    const matchesAttribute = selectedAttributes.length === 0 || selectedAttributes.some(attr => card.attribute && card.attribute.split(' / ').includes(attr));
    const matchesTag = tag ? card.tag && card.tag.split(' / ').includes(tag) : true;  // 標籤篩選
    const matchesSet = set ? (card.set && Array.isArray(card.set) ? card.set.some(s => s.includes(set)) : card.set.includes(set)) : true;  // 卡包篩選

    // 返回符合所有條件的卡牌
    return matchesKeyword && matchesType && matchesBloom && matchesAttribute && matchesTag && matchesSet;
  });

  // 去重邏輯：基於卡牌的所有篩選條件去重
  const uniqueCards = removeDuplicates(filteredCards);
  filteredCards = uniqueCards;
  currentPage = 0;
  displayCards(filteredCards);
}

// 去重函數，根據所有篩選條件（名稱、類型、綻放等級、屬性、標籤、卡包）進行去重
function removeDuplicates(cards) {
  const seen = new Set();
  const uniqueCards = [];

  cards.forEach(card => {
    // 使用一個唯一的識別符來檢查是否已經處理過該卡牌
    const uniqueKey = `${card.name}-${card.type}-${card.bloom}-${card.attribute}-${card.tag}-${card.set}`;
        
    if (!seen.has(uniqueKey)) {
      seen.add(uniqueKey);
      uniqueCards.push(card);
    }
  });

  return uniqueCards;
}

// 顯示卡牌的詳細資訊
function showPopup(card, index) {
  document.body.style.overflow = "hidden";  // 禁用背景滾動
  
  // 獲取彈窗內容區域
  const popupleft = document.getElementById('popupLeft');
  const popupright = document.getElementById('popupRight');

  popupleft.innerHTML = '';
  popupright.innerHTML = '';
  
  // 創建左側區域 (顯示卡牌圖片)
  const leftContent = document.createElement('div');
  leftContent.className = 'popup-left';
  leftContent.innerHTML = `
    <img id="popupImage" src="${card.image}" alt="${card.name}">
  `;

  // 填充右側詳細資料
  const rightContent = document.createElement('div');
  rightContent.className = 'popup-right';
  rightContent.innerHTML = `
    <h2>${card.name}</h2>
    <p><strong><span class="label">類型</span></strong> ${card.type}</p>
  `;

  if (card.type === "主推") {
    rightContent.innerHTML += `
      <div id="popupOshiType">
        <p><strong><span class="label">屬性</span></strong> ${card.attribute}</p>
        <p><strong><span class="label">生命值</span></strong> ${card.life}</p>
        <p><strong><span class="label skill">主推技能</span></strong> ${card.skill}</p>
        <p><strong><span class="label spSkill">SP主推技能</span></strong> ${card.spSkill}</p>
        <p><strong><span class="label">卡包</span></strong> ${card.set}</p>
        <p><strong><span class="label">卡牌編號</span></strong> ${card.id}</p>
      </div>`;
  }

  if (card.type === "成員") {
    rightContent.innerHTML += `
      <div id="popupHolomenType">
        <p><strong><span class="label">綻放等級</span></strong> ${card.bloom}</p>
        <p><strong><span class="label">標籤</span></strong> ${card.tag}</p>
        <p><strong><span class="label">屬性</span></strong> ${card.attribute}</p>
        <p><strong><span class="label">體力</span></strong> ${card.hp}</p>
        ${card.collabEffect ? `<p><strong><span class="label collab">聯動</span></strong> ${card.collabEffect}</p>` : ''}
        ${card.bloomEffect ? `<p><strong><span class="label bloom">綻放</span></strong> ${card.bloomEffect}</p>` : ''}
        ${card.giftEffect ? `<p><strong><span class="label gift">天賦</span></strong> ${card.giftEffect}</p>` : ''}
        ${card.skill1 ? `
          <p>
            <strong><span class="label skill1">藝能</span></strong>
            <div style="display: flex; flex-direction: row; gap: 8px; align-items: center; white-space: nowrap;">
              ${card.skill1.images.map(image => `
                <img src="${image}" alt="Skill Image" style="width: 24%; max-height: 300px; object-fit: contain;">
              `).join('')}
            </div>
            ${card.skill1.description ? `
              <div>
                <span>${card.skill1.description}</span>
              </div>
            ` : ''}
          </p>
        ` : ''}
        ${card.skill2 ? `
          <p>
            <strong><span class="label skill1">藝能</span></strong>
            <div style="display: flex; flex-direction: row; gap: 8px; align-items: center; white-space: nowrap;">
              ${card.skill2.images.map(image => `
                <img src="${image}" alt="Skill Image" style="width: 24%; max-height: 300px; object-fit: contain;">
              `).join('')}
            </div>
            ${card.skill2.description ? `
              <div>
                <span>${card.skill2.description}</span>
              </div>
            ` : ''}
          </p>
        ` : ''}
        <p><strong><span class="label">交棒</span></strong>
          ${card.batonImage[0] ? `<img id="popupBatonImage1" src="${card.batonImage[0]}" alt="Baton Image 1" style="display: block; width: 48%; max-height: 300px; object-fit: contain; margin-right: 4%;">` : ''}
          ${card.batonImage[1] ? `<img id="popupBatonImage2" src="${card.batonImage[1]}" alt="Baton Image 2" style="display: block; width: 48%; max-height: 300px; object-fit: contain;">` : ''}
        </p>
        ${card.rule ? `<p><strong><span class="label rule">特殊規則</span></strong> ${card.rule}</p>` : ''}
        <p><strong><span class="label">卡包</span></strong> ${card.set}</p>
        <p><strong><span class="label">卡牌編號</span></strong> ${card.id}</p>
      </div>`;
  }

  if (card.type.includes("支援")) {
    rightContent.innerHTML += `
      <div id="popupSupportType">
        ${card.tag ? `<p><strong><span class="label">標籤</span></strong> ${card.tag}</p>` : ''}
        <p><strong><span class="label">效果</span></strong> ${card.supportEffect}</p>
        <p><strong><span class="label">卡包</span></strong> ${card.set}</p>
        <p><strong><span class="label">卡牌編號</span></strong> ${card.id}</p>
      </div>`;
  }

  if (card.type === "吶喊") {
    rightContent.innerHTML += `
      <div id="popupYellType">
        <p><strong><span class="label">屬性</span></strong> ${card.attribute}</p>
        <p><strong><span class="label">效果</span></strong> ${card.yellEffect}</p>
        <p><strong><span class="label">卡包</span></strong> ${card.set}</p>
        <p><strong><span class="label">卡牌編號</span></strong> ${card.id}</p>
      </div>`;
  }

  popupleft.appendChild(leftContent);
  popupright.appendChild(rightContent);
    
  document.getElementById('popup').style.display = 'flex';

  // 設置左右箭頭的事件，基於篩選後的卡牌
  document.getElementById('arrowLeft').onclick = () => {
    const previousIndex = (currentIndex - 1 + filteredCards.length) % filteredCards.length;  // 處理循環
    currentIndex = previousIndex;  // 更新目前索引
    showPopup(filteredCards[previousIndex], previousIndex);  // 顯示上一張卡牌
  };

  document.getElementById('arrowRight').onclick = () => {
    const nextIndex = (currentIndex + 1) % filteredCards.length;  // 處理循環
    currentIndex = nextIndex;  // 更新目前索引
    showPopup(filteredCards[nextIndex], nextIndex);  // 顯示下一張卡牌
  };
}

// 關閉彈窗
document.getElementById('closePopup').addEventListener('click', function() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
  document.body.style.overflow = "auto";  // 恢復背景滾動
});

// 點擊彈窗外部區域關閉彈窗
document.getElementById("popup").addEventListener("click", (e) => {
  if (e.target === document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
    document.body.style.overflow = "auto";  // 恢復背景滾動
  }
});

// 滾動到頁面最上方
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 滾動隱藏 header
let lastScrollTop = 0;  // 上次滾動的位置
let hideThreshold = 100;  // 滾動距離達到 100px 時才開始隱藏 header

window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop && currentScroll > hideThreshold) {
    // 滾動往下，隱藏 header
    header.classList.add('hidden');
  } else {
    // 滾動往上，顯示 header
    header.classList.remove('hidden');
  }

  // 更新滾動位置
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;  // 防止滾動過多
});
