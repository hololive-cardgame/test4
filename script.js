const cardsPerPage = 10;  // 設置每頁顯示的卡牌數量
let currentPage = 0;  // 初始頁面是第一頁
let filteredCards = []; // 儲存篩選後的卡牌

// 讀取卡牌資料的函式
function loadCards() {
  fetch('cards.json')  // 假設你的 JSON 檔案放在網站的根目錄下
    .then(response => response.json())  // 解析JSON資料
    .then(cards => {
      // 儲存卡牌資料
      window.cards = cards;
      filteredCards = cards;  // 初始情況下顯示所有卡牌

      // 顯示當前頁的卡牌
      displayCards();

      // 顯示頁碼
      updatePagination();

      // 填充關鍵字選單
      populateKeywordSelect(cards);
    })
    .catch(error => {
      console.error('載入卡牌資料時發生錯誤:', error);
    });
}

// 填充關鍵字選單
function populateKeywordSelect(cards) {
  const keywordSelect = document.getElementById('keywordSelect');
  const uniqueNames = [...new Set(cards.map(card => card.name))]; // 取得所有不重複的卡牌名稱

  // 清空下拉選單
  keywordSelect.innerHTML = '';

  // 填充其他選項
  uniqueNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    keywordSelect.appendChild(option);
  });

  // 這裡不添加空選項，而是讓 select 元素本身保持預設為空
  keywordSelect.value = "";  // 預設為空

  // 監聽選擇事件，根據選擇的關鍵字過濾卡牌
  keywordSelect.addEventListener('change', (e) => {
    const keyword = e.target.value;
    filterCards(keyword);
  });
}

// 根據關鍵字過濾卡牌
function filterCards(keyword) {
  if (keyword === "") {
    filteredCards = window.cards;  // 如果沒有關鍵字，顯示所有卡牌
    document.getElementById("clearKeywordBtn").style.display = "none";  // 隱藏清除按鈕
  } else {
    filteredCards = window.cards.filter(card => card.name.includes(keyword));  // 根據卡牌名稱過濾
    document.getElementById("clearKeywordBtn").style.display = "inline-block";  // 顯示清除按鈕
  }

  currentPage = 0;  // 重置頁面為第一頁
  displayCards();
  updatePagination();
}

// 顯示當前頁的卡牌
function displayCards() {
  const cardsContainer = document.getElementById("cardContainer");
  cardsContainer.innerHTML = '';  // 清空容器

  // 檢查是否有篩選結果
  if (filteredCards.length === 0) {
    const noResultsMessage = document.createElement('p');
    noResultsMessage.textContent = "沒有符合的資料";
    noResultsMessage.style.textAlign = "center";  // 可以加一些 CSS 調整顯示樣式
    noResultsMessage.style.fontSize = "18px";
    noResultsMessage.style.color = "#cc101a";  // 可以自定義顏色
    cardsContainer.appendChild(noResultsMessage);
    return; // 如果沒有結果，就不再顯示卡牌
  }

  // 計算當前頁要顯示的卡牌範圍
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentPageCards = filteredCards.slice(startIndex, endIndex);

  // 生成卡牌
  currentPageCards.forEach(card => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `<img src="${card.image}" alt="${card.name}" />`;

    // 點擊卡牌顯示詳細資訊
    cardElement.addEventListener("click", () => showPopup(card));

    cardsContainer.appendChild(cardElement);
  });
}

// 清除關鍵字查詢
document.getElementById("clearKeywordBtn").addEventListener("click", () => {
  document.getElementById("keywordSelect").value = "";  // 重置選擇框
  filterCards("");  // 清除過濾，顯示所有卡牌
});

// 顯示卡牌的詳細資訊
function showPopup(card) {
  document.getElementById("popup").style.display = "flex";  // 顯示彈窗
  document.body.style.overflow = "hidden";  // 禁用背景滾動
  document.getElementById("popupImage").src = card.image;
  document.getElementById("popupName").textContent = card.name;

  // 隱藏所有區域
  document.getElementById('popupOshiType').style.display = 'none';
  document.getElementById('popupHolomenType').style.display = 'none';

  // 根據卡牌類型顯示對應的區域
  if (card.type === 'oshi') {
    document.getElementById('popupOshiType').style.display = 'block';
    document.getElementById('popupOshiAttribute').textContent = card.attribute;
    document.getElementById('popupLife').textContent = card.life;
    document.getElementById('popupSkill').textContent = card.skill;
    document.getElementById('popupspSkill').textContent = card.spSkill;
    document.getElementById('popupOshiId').textContent = card.id;
  }
  
  if (card.type === 'holomen') {
    document.getElementById('popupHolomenType').style.display = 'block';
    document.getElementById('popupTag').textContent = card.tag;
    document.getElementById('popupHolomenAttribute').textContent = card.attribute;
    document.getElementById('popupHP').textContent = card.hp;
    document.getElementById('popupBloom').textContent = card.bloom;
    document.getElementById('popupHolomenId').textContent = card.id;
    
    // 處理 batonImage 的情況
    const batonImage1 = document.getElementById("popupBatonImage1");
    const batonImage2 = document.getElementById("popupBatonImage2");

    if (card.batonImage && card.batonImage.length > 0) {
      // 有圖片，顯示第一張圖片，第二張圖片為空的情況
      batonImage1.src = card.batonImage[0]; // 設置第一張圖片
      batonImage1.style.display = "inline-block";  // 顯示圖片

      if (card.batonImage.length > 1) {
        batonImage2.src = card.batonImage[1];  // 設置第二張圖片
        batonImage2.style.display = "inline-block";  // 顯示第二張圖片
      } else {
        batonImage2.style.display = "none";  // 隱藏第二張圖片
      }
    } else {
      // 如果 batonImage 是空數組，隱藏圖片
      batonImage1.style.display = "none";
      batonImage2.style.display = "none";
    }

    // 如果有聯動效果，顯示並更新它
    if (card.collabEffect) {
      document.getElementById('popupCollabEffectContainer').style.display = 'block';
      document.getElementById('popupCollabEffect').textContent = card.collabEffect;
    }else{
      document.getElementById('popupCollabEffectContainer').style.display = 'none';
    }
    
    // 如果有綻放效果，顯示並更新它
    if (card.bloomEffect) {
      document.getElementById('popupBloomEffectContainer').style.display = 'block';
      document.getElementById('popupBloomEffect').textContent = card.bloomEffect;
    }else{
      document.getElementById('popupBloomEffectContainer').style.display = 'none';
    }
    
    // 如果有天賦效果，顯示並更新它
    if (card.giftEffect) {
      document.getElementById('popupGiftEffectContainer').style.display = 'block';
      document.getElementById('popupGiftEffect').textContent = card.giftEffect;
    }else{
      document.getElementById('popupGiftEffectContainer').style.display = 'none';
    }
    
    // 如果有技能 1，顯示並更新它
    if (card.skill1) {
      document.getElementById('popupSkill1Container').style.display = 'block';
      document.getElementById('popupSkill1').textContent = card.skill1;
    }else{
      document.getElementById('popupSkill1Container').style.display = 'none';
    }

    // 如果有技能 2，顯示並更新它
    if (card.skill2) {
      document.getElementById('popupSkill2Container').style.display = 'block';
      document.getElementById('popupSkill2').textContent = card.skill2;
    }else{
      document.getElementById('popupSkill2Container').style.display = 'none';
    }

    // 如果有特殊規則，顯示並更新它
    if (card.rule) {
      document.getElementById('popupRuleContainer').style.display = 'block';
      document.getElementById('popupRule').textContent = card.rule;
    }else{
      document.getElementById('popupRuleContainer').style.display = 'none';
    }
  }
  
  // 儲存目前顯示的卡牌索引
  window.currentCardIndex = window.cards.indexOf(card);
}

// 更新分頁顯示，實現省略號分頁
function updatePagination() {
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);  // 根據篩選後的卡片數量來計算頁數
  const paginationContainer = document.getElementById("pagination");

  // 清空分頁容器
  paginationContainer.innerHTML = '';

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

  // 添加上一頁按鈕
  const prevPageButton = document.createElement("button");
  prevPageButton.classList.add('page-button');
  prevPageButton.disabled = currentPage === 0; // 當前頁是第一頁時禁用上一頁按鈕
  prevPageButton.textContent = "<";
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      displayCards();
      updatePagination();
      scrollToTop();
    }
  });
  paginationContainer.appendChild(prevPageButton);

  // 顯示前面的頁碼
  if (startPage > 0) {
    const firstPageButton = document.createElement("button");
    firstPageButton.textContent = "1";
    firstPageButton.classList.add('page-button');
    firstPageButton.addEventListener('click', () => {
      currentPage = 0;
      displayCards();
      updatePagination();
      scrollToTop();
    });
    paginationContainer.appendChild(firstPageButton);

    // 如果沒有顯示第一頁和省略號，添加省略號
    if (startPage > 1) {
      const ellipsisButton = document.createElement("span");
      ellipsisButton.textContent = "...";
      paginationContainer.appendChild(ellipsisButton);
    }
  }

  // 顯示中間的頁碼
  for (let i = startPage; i < endPage; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i + 1;
    pageButton.classList.add('page-button');
    if (i === currentPage) {
      pageButton.classList.add('active');  // 高亮顯示當前頁
    }

    // 點擊頁碼按鈕跳轉到該頁
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayCards();
      updatePagination();
      scrollToTop();
    });

    paginationContainer.appendChild(pageButton);
  }

  // 顯示後面的頁碼
  if (endPage < totalPages) {
    // 如果沒有顯示最後一頁，顯示省略號
    if (endPage < totalPages - 1) {
      const ellipsisButton = document.createElement("span");
      ellipsisButton.textContent = "...";
      paginationContainer.appendChild(ellipsisButton);
    }

    const lastPageButton = document.createElement("button");
    lastPageButton.textContent = totalPages;
    lastPageButton.classList.add('page-button');
    lastPageButton.addEventListener('click', () => {
      currentPage = totalPages - 1;
      displayCards();
      updatePagination();
      scrollToTop();
    });
    paginationContainer.appendChild(lastPageButton);
  }

  // 添加下一頁按鈕
  const nextPageButton = document.createElement("button");
  nextPageButton.classList.add('page-button');
  nextPageButton.disabled = currentPage === totalPages - 1; // 當前頁是最後一頁時禁用下一頁按鈕
  nextPageButton.textContent = ">";
  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      displayCards();
      updatePagination();
      scrollToTop();
    }
  });
  paginationContainer.appendChild(nextPageButton);
}

// 滾動到頁面最上方
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 切換到上一頁
function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    displayCards();
    updatePagination();
  }
}

// 切換到下一頁
function nextPage() {
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);  // 使用篩選後的卡片數量來計算總頁數
  if (currentPage < totalPages - 1) {
    currentPage++;
    displayCards();
    updatePagination();
  }
}

// 切換到上一張卡牌
function prevCard() {
  if (window.currentCardIndex === undefined || filteredCards.length === 0) return;
  window.currentCardIndex = (window.currentCardIndex - 1 + filteredCards.length) % filteredCards.length; // 循環往回
  const card = window.cards[window.currentCardIndex];
  showPopup(card);
}

// 切換到下一張卡牌
function nextCard() {
  if (window.currentCardIndex === undefined || filteredCards.length === 0) return;
  window.currentCardIndex = (window.currentCardIndex + 1) % filteredCards.length; // 循環往前
  const card = window.cards[window.currentCardIndex];
  showPopup(card);
}

// 關閉彈窗
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";  // 隱藏彈窗
  document.body.style.overflow = "auto";  // 恢復背景滾動
});

// 點擊彈窗外部區域關閉彈窗
document.getElementById("popup").addEventListener("click", (e) => {
  if (e.target === document.getElementById("popup")) {
    document.getElementById("popup").style.display = "none";
    document.body.style.overflow = "auto";  // 恢復背景滾動
  }
});

// 監聽左右箭頭的點擊事件
document.getElementById("arrowLeft").addEventListener("click", prevCard);  // 左箭頭
document.getElementById("arrowRight").addEventListener("click", nextCard);  // 右箭頭

// 頁面加載後載入卡牌資料
window.onload = loadCards;

let lastScrollTop = 0; // 上次滾動的位置

window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // 滾動往下，隱藏 header
    header.classList.add('hidden');
  } else {
    // 滾動往上，顯示 header
    header.classList.remove('hidden');
  }

  // 更新滾動位置
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // 防止滾動過多
});
