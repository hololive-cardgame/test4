<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>多重下拉菜单</title>
  <style>
    .dropdown {
      position: relative;
      width: 200px;
    }

    .dropdown-selected {
      padding: 10px;
      background-color: #fff;
      border: 1px solid #ccc;
      cursor: pointer;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: none;
      background-color: #fff;
      border: 1px solid #ccc;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }

    .dropdown-menu.open {
      display: block;
    }

    .dropdown-item {
      padding: 10px;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background-color: #f1f1f1;
    }
  </style>
</head>
<body>

  <div class="dropdown">
    <div class="dropdown-selected" id="dropdown-selected-keyword">選擇關鍵字</div>
    <ul class="dropdown-menu" id="dropdown-menu-keyword">
      <!-- 選項會在 JavaScript 中動態添加 -->
    </ul>
  </div>

  <div class="dropdown">
    <div class="dropdown-selected" id="dropdown-selected-type">選擇類型</div>
    <ul class="dropdown-menu" id="dropdown-menu-type">
      <!-- 選項會在 JavaScript 中動態添加 -->
    </ul>
  </div>

  <div class="dropdown">
    <div class="dropdown-selected" id="dropdown-selected-tag">選擇標籤</div>
    <ul class="dropdown-menu" id="dropdown-menu-tag">
      <!-- 選項會在 JavaScript 中動態添加 -->
    </ul>
  </div>

  <div class="dropdown">
    <div class="dropdown-selected" id="dropdown-selected-set">選擇卡包</div>
    <ul class="dropdown-menu" id="dropdown-menu-set">
      <!-- 選項會在 JavaScript 中動態添加 -->
    </ul>
  </div>

  <script>
    // 获取所有的下拉菜单
    const dropdowns = document.querySelectorAll('.dropdown');

    // 模拟选项的数据
    const options = {
      "keyword": ["選項1", "選項2", "選項3"],
      "type": ["類型A", "類型B", "類型C"],
      "tag": ["標籤X", "標籤Y", "標籤Z"],
      "set": ["卡包1", "卡包2", "卡包3"]
    };

    // 填充每个下拉菜单的选项
    Object.keys(options).forEach(key => {
      const menu = document.getElementById(`dropdown-menu-${key}`);
      options[key].forEach(option => {
        const li = document.createElement("li");
        li.classList.add("dropdown-item");
        li.textContent = option;
        li.addEventListener("click", () => {
          document.getElementById(`dropdown-selected-${key}`).textContent = option;
          menu.classList.remove("open");
        });
        menu.appendChild(li);
      });
    });

    // 为每个下拉框添加点击事件
    dropdowns.forEach(dropdown => {
      const dropdownSelected = dropdown.querySelector('.dropdown-selected');
      const dropdownMenu = dropdown.querySelector('.dropdown-menu');

      // 点击下拉框切换显示
      dropdownSelected.addEventListener('click', (e) => {
        e.stopPropagation();  // 阻止点击事件冒泡到文档，避免外部关闭菜单
        dropdownMenu.classList.toggle('open');  // 切换当前菜单的显示状态
      });
    });

    // 点击外部区域关闭所有下拉菜单
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
          const menu = dropdown.querySelector('.dropdown-menu');
          menu.classList.remove('open');
        });
      }
    });
  </script>

</body>
</html>
