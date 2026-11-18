  const btn1 = document.getElementById("box1");
    const btn2 = document.getElementById("box2");
    const btn3 = document.getElementById("box3");
    const bntgo = document.getElementById("bntgo");
    const bntusergo = document.getElementById("bntusergo");

    const fruits = [
      "url('./img/scissors.png')", 
      "url('./img/rock.png')", 
      "url('./img/paper.png')"
    ];

    function ckvalue(a, b) {
      if (a === b) return "平手";

      const winConditions = {
        "0-2": "電腦勝利", // 剪刀(0) 贏 布(2)
        "1-0": "電腦勝利", // 石頭(1) 贏 剪刀(0)
        "2-1": "電腦勝利"  // 布(2) 贏 石頭(1)
      };

      return winConditions[`${a}-${b}`] || "玩家勝利";
    }

    // 🌟 共用動畫函式：接收一個 callback（當 1 秒滾動結束後要做甚麼事）
    function playAnimation(callback) {
      btn2.textContent = "🤔 思考中..."; 

      // 開啟循環定時器：每 50 毫秒變換一次圖片
      let scrollTimer = setInterval(radombtn, 50);

      // 設定 1000 毫秒（1秒）後停止滾動，並執行傳入的 callback
      setTimeout(function() {
        clearInterval(scrollTimer); 
        callback();
      }, 1000);
    }

    // 1. 隨機猜拳按鈕
    bntgo.addEventListener('click', function(){
      clearActive();

      // 呼叫共用動畫，結束後隨機決定雙方出拳並判斷輸贏
      playAnimation(function() {
        let finalPc = Math.floor(Math.random() * fruits.length);
        let finalUser = Math.floor(Math.random() * fruits.length);

        btn1.style.backgroundImage = fruits[finalPc];
        btn3.style.backgroundImage = fruits[finalUser];
        btn2.textContent = ckvalue(finalPc, finalUser);
      });
    });

    // 2. 自訂出拳按鈕 (改用 SweetAlert2 彈窗取代原本的 prompt)
    bntusergo.addEventListener('click', async function(){
      const { value: userIndex } = await Swal.fire({
        title: '❔自訂出拳',
        text: '請選擇你要出的拳：',
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '布 🖐️',
        showDenyButton: false,
        confirmButtonColor: '#ff7e5f',
        cancelButtonColor: '#aaa',
        // 透過 preConfirm 回傳對應的索引值 (0: 剪刀, 1: 石頭, 2: 布)
        html: `
          <div style="display: flex; justify-content: center; gap: 15px; margin-top: 10px;">
            <button type="button" class="swal2-btn-choice setgo" data-val="0" >✌️ 剪刀</button>
            <button type="button" class="swal2-btn-choice setgo" data-val="1">✊ 石頭</button>
            <button type="button" class="swal2-btn-choice setgo" data-val="2">🖐️ 布</button>
          </div>
        `,
        showConfirmButton: false, // 隱藏預設的確認按鈕，改用自訂 HTML 裡的按鈕
        didOpen: () => {
          // 綁定自訂按鈕的點擊事件
          const buttons = Swal.getPopup().querySelectorAll('.swal2-btn-choice');
          buttons.forEach(button => {
            button.addEventListener('click', () => {
              const val = parseInt(button.getAttribute('data-val'));
              Swal.close(); // 關閉彈窗
              seckubtn(val); // 執行對應的遊戲邏輯
            });
          });
        }
      });
    });

    const setgo = ['ubox1','ubox2','ubox3'];
    setgo.forEach( names =>{
      const btname = document.getElementById(names);
      btname.addEventListener('click',function(){
        if(names==="ubox1"){
          seckubtn(0);
        } else if(names==="ubox2"){
          seckubtn(1);
        } else if(names==="ubox3"){
          seckubtn(2);
        }
      });
    });

    // ✨ 3. 自訂出拳
    function seckubtn(type) {
      clearActive();

      // 先點亮的選中方框
      document.getElementById("ubox" + (type + 1)).classList.add("active");

      // 呼叫共用動畫，動畫結束後才鎖定玩家的選擇並結算
      playAnimation(function() {
        btn3.style.backgroundImage = fruits[type];
        let pcIndex = Math.floor(Math.random() * fruits.length);
        btn1.style.backgroundImage = fruits[pcIndex];

        btn2.textContent = ckvalue(pcIndex, type);
      });
    }

    // 清除所有下方按鈕的 active 狀態
    function clearActive() {
      document.getElementById("ubox1").classList.remove("active");
      document.getElementById("ubox2").classList.remove("active");
      document.getElementById("ubox3").classList.remove("active");

      document.getElementById("box1").textContent="";
      document.getElementById("box2").textContent="";
      document.getElementById("box3").textContent="";
    }

    // 1 秒內出現亂數的變動
    function radombtn(){
      let randomIndex = Math.floor(Math.random() * fruits.length);
      btn1.style.backgroundImage = fruits[randomIndex];

      let userIndex = Math.floor(Math.random() * fruits.length);
      btn3.style.backgroundImage = fruits[userIndex];
    }