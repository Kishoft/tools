const deg = 6,
    hr = document.getElementById('hr'),
    mn = document.getElementById('mn'),
    sc = document.getElementById('sc')
    
setInterval(() => {
    let time = new Date(),
    hh = time.getHours() * 30,
    mm = time.getMinutes() * deg,
    ss = time.getSeconds() * deg;
    hr.style.transform = `rotateZ(${(hh)+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;

}, 1000)

