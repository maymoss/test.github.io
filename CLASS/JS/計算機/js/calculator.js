
    function goget(name) {
      let btn = document.getElementById(name);      
      let total = document.getElementById("total");
      let keys = document.getElementById("keys");

      // const cknum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; 暫時用不到，原本想增加判斷輸入數字的部分。後面直接擋掉即可
      const ckkeys = ["+", "-", "*", "/", "%", "=", "(", ")"];

      btn.addEventListener('click', function () {
        let strs = btn.textContent;
        if (!strs) return; // 如果按鈕沒有文字（空白格）就不動作

        // 順序不可顛倒，如要顛倒。判斷式必須重寫
        if (strs === "C") { // 清除重來
          total.textContent = "0";
          keys.textContent = "";
        } else if (strs === "=") { // 計算結果
          try {
            let currentKeys = keys.textContent;
            currentKeys = currentKeys.replace(/^0+(?!\.)/, '');
            total.textContent = eval( currentKeys ); // 直接使用函式計算
          } catch (error) {
            total.textContent = "計算式錯誤，請重新輸入!";
          }
        } else if (strs === "del") { //刪除最後一個字
          if (keys.textContent.length > 0) {
            keys.textContent = keys.textContent.slice(0, -1);
            if (keys.textContent.length === 0) {
              total.textContent = "0";
              keys.textContent = "";
            }
          }
        } else if (ckkeys.includes(strs)) { // 計算法按鈕輸入
          keys.textContent = keys.textContent + strs;
          total.textContent = strs;
        } else {
          if (total.textContent === "0" && keys.textContent.length === 0) {
            total.textContent = strs;
            keys.textContent = strs;
          } else {
            total.textContent = strs;
            keys.textContent = keys.textContent + strs;
          }
        }
      });
    }

    document.addEventListener('DOMContentLoaded', function () { // 使用隨時等待模式
      let btnnumarr = ["btn_0", "btn_1", "btn_2", "btn_3", "btn_4", "btn_5", "btn_6", "btn_7", "btn_8", "btn_9"];
      let btnkeys = ["btn_P", "btn_zero", "btn_del", "btn_dot", "btn_equals", "btn_C", "btn_add", "btn_X", "btn_gain", "btn_lsb", "btn_rsb"];

      for (let i = 0; i < btnnumarr.length; i++) { // 操作數字鍵
        goget(btnnumarr[i]);
      }

      for (let i = 0; i < btnkeys.length; i++) { // 操作計算鍵
        goget(btnkeys[i]);
      }
    });