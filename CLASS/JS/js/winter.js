    const btngetcity = document.getElementById("getcity");
    btngetcity.addEventListener('click',async e =>{
      e.preventDefault();

      try{
        const rs = await fetch("https://taiwan.md/assets/geo/taiwan-country.topo.json",{
          method: 'get',
          cache: "no-store"
        });
        const result = await rs.json().catch(() => null);
        const rdata = result.objects.map.geometries;
        const scity = document.getElementById("scity");
        const sel = document.createElement('select');
        sel.id = 'selcity';
        sel.multiple = true;
        sel.size = 8;   // 一次顯示 8 個選項，可按住 Ctrl / Shift 複選
        sel.innerHTML = document.getElementById('selcity').innerHTML + '<option value="all">0：全部</option>' + rdata.map((item , index) => {
            const name = item.properties.name;
            const cnts = index+1;
            return '<option value="' + name + '">' + cnts + '：' + name + '</option>';
          }).join('');
        scity.innerHTML = '<label for="selcity">選擇縣市（可按住 Ctrl / Cmd 複選）：</label>';
        scity.appendChild(sel);

        // 選擇縣市後 → 載入天氣卡片
        sel.addEventListener('change', async () => {

          const cardsmain = document.getElementById("cardsmain");
          // 多選：取得所有被選到的選項值
          let cities = [...sel.selectedOptions].map(op => op.value).filter(v => v);  // 已移除提示用的空白值 option
          if (cities.length === 0) { cardsmain.innerHTML = ''; return; }

          // 選了「全部」→ 展開成所有縣市
          if (cities.includes('all')) {
            cities = rdata.map(item => item.properties.name);
          }

          // 先顯示載入中的卡片
          cardsmain.innerHTML = cities.map(() => '<div class="wcard loading">載入中...</div>').join('');

          // 中央氣象署開放資料 API
          // locationName 可用逗號帶多個縣市；全帶22縣市不如省略參數(等同全部)
          const API_URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-AA4369C0-ECF8-480B-BA1B-EDB7548A7E33&elementName=Wx,PoP,MinT,MaxT'
            + (cities.length >= rdata.length ? '' : '&locationName=' + encodeURIComponent(cities.join(',')));

          try {
            const rsdata = await fetch(API_URL);
            if (!rsdata.ok) throw new Error('HTTP ' + rsdata.status);
            const rsdatajs = await rsdata.json();
            let locas = [];
            if (rsdatajs.records && rsdatajs.records.location) {
              locas = rsdatajs.records.location;
            }

            const cards = cities.map(name => {
              let loc = null;
              for (let i = 0; i < locas.length; i++) {
                if (locas[i].locationName === name) {
                  loc = locas[i];
                  break;
                }
              }
              if (!loc) return '';

              // 每個 elementName 的第一個時段，取 parameter.parameterName（中文值）
              const evalue = {};
              loc.weatherElement.forEach(value => { 
                evalue[value.elementName] = value.time[0].parameter.parameterName; 
              });

              let wx = '';
              if (evalue['Wx']) {
                wx = evalue['Wx'];
              } else {
                wx = '';
              }
              let icon = '🌤️';              // 預設圖示
              if (wx.indexOf('雷') !== -1) {
                icon = '⛈️';
              } else if (wx.indexOf('雨') !== -1) {
                icon = '🌧️';
              } else if (wx.indexOf('雪') !== -1 || wx.indexOf('冰') !== -1 || wx.indexOf('霰') !== -1) {
                icon = '❄️';
              } else if (wx.indexOf('陰') !== -1) {
                icon = '☁️';
              } else if (wx.indexOf('雲') !== -1) {
                icon = '⛅';
              } else if (wx.indexOf('晴') !== -1) {
                icon = '☀️';
              }

              return '<div class="wcard">' +
                       '<div class="cname">' + name + '</div>' +
                       '<div class="cicon">' + icon + '</div>' +
                       '<div class="cweather">' + wx + '</div>' +
                       '<div class="ctemp">' + evalue['MinT'] + ' ~ ' + evalue['MaxT'] + ' <small>°C</small></div>' +
                       '<div class="crain">☔ 降雨機率：' + (evalue['PoP'] || '0') + '%</div>' +
                     '</div>';
            }).join('');
            cardsmain.innerHTML = cards;
          } catch (err) {
            cardsmain.innerHTML = '<div class="wcard loading">天氣資料載入失敗，請稍後再試</div>';
            console.error(err);
          }
        });
      } catch( err ){
        console.error(err);
      }
    });