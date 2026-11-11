// 產生六個面的點數 HTML
    function buildFaces(dice) {
      for (let p = 1; p <= 6; p++) {
        const face = document.createElement('div');
        face.className = 'face';
        face.dataset.p = p;
        for (let i = 0; i < p; i++) {
          const pip = document.createElement('div');
          pip.className = 'pip';
          face.appendChild(pip);
        }
        dice.appendChild(face);
      }
    }

    const dices = document.querySelectorAll('.dice');
    dices.forEach(buildFaces);

    // 用來做選轉角度用
    const turnpoint = {
      1: [0, 0],
      2: [0, -90],
      3: [0, -180],
      4: [0, 90],
      5: [-90, 0],
      6: [90, 0]
    };

    const showjieguo = document.getElementById('showjieguo');
    const rollBtn = document.getElementById('rollBtn');

    // 初始化骰子角度
    const current = Array.from(dices, () => ({ x: 0, y: 0 }));

    rollBtn.addEventListener('click', () => {
      const history = [];
      rollBtn.disabled = true;   // 骰動中避免重複按
      // showjieguo.textContent = "";
      // 使用for迴圈 一次骰15下
      for(let ii=0;ii<15;ii++){
        setTimeout(() => {
          const results = Array.from(dices, () => Math.floor(Math.random() * 6) + 1);
          //console.log(dices);
          dices.forEach((dice, i) => {
            // 累積角度 + 隨機整圈數，讓骰子骰動時有動畫的效果
            const [ex, ey] = turnpoint[results[i]];
            const spins = 2 + Math.floor(Math.random() * 3);   // 多轉 2~4 整圈
            current[i].x += 360 * spins;
            current[i].y += 360 * spins;
            dice.style.transform =
              'rotateX(' + (current[i].x + ex) + 'deg) rotateY(' + (current[i].y + ey) + 'deg)';
          });
          //console.log(dices);
          // 動畫結束後顯示結果
          history.push(results);
          if (history.length > 15) history.shift();
          showjieguo.innerHTML = history.map((r , index) => {
            const same = r[0] === r[1] && r[1] === r[2];
            const cnts = index+1;
            return '<p' + (same ? ' class="same"' : '') + '>' + '第' + cnts + '次：' + r.join(' , ') + '</p>';
          }).join('');
          
          // 如果這是最後一次（第 14 次），就把按鈕解鎖
          if (ii === 14) {
            console.log(ii);
            rollBtn.disabled = false;
          }
          
        },ii * 1000); // 透過 ii 遞增延遲時間（錯開各次執行的時間點，製造依序執行的動畫效果）
      }
    });