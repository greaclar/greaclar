        window.onload = function(){
            let oTable = document.getElementById('table')
            let oGround = document.getElementById('ground')
            let oTips = document.getElementById('tips')
            let iB = 0
            let iNum = 0
            let aBtn = []
            for(i = 0;i<5;i++){
                aBtn[i] = []
                for(j = 0;j<5;j++){
                    aBtn[i][j] = document.createElement('li')
                    aBtn[i][j].innerHTML = '<p>.</p>'
                    aBtn[i][j].setAttribute('x',i)
                    aBtn[i][j].setAttribute('y',j)
                    aBtn[i][j].setAttribute('z',0)
                    aBtn[i][j].addEventListener('click',function(){
                        let ix = parseInt(this.getAttribute('x')) 
                        let iy = parseInt(this.getAttribute('y')) 
                        if(iB === 0){
                                iB = 1
                                fnTurn(ix,iy)
                                if(ix < 4) fnTurn(ix+1,iy)
                                if(ix > 0) fnTurn(ix-1,iy)
                                if(iy < 4) fnTurn(ix,iy+1)
                                if(iy > 0) fnTurn(ix,iy-1)
                                iB = 0
                            }
                    })
                    oTable.appendChild(aBtn[i][j])
                }//for j
            }//for i
            function fnTurn(ix,iy){
                let iZ = parseInt(aBtn[ix][iy].getAttribute('z'))
                if(iZ === 1){
                    aBtn[ix][iy].setAttribute('z',0)
                    iNum--
                }
                else if(iZ === 0){
                    aBtn[ix][iy].setAttribute('z',1)
                    iNum++
                }
            }//turn 
            ;(function(){
                fnTraverse()
                window.addEventListener('resize',function(){
                    fnTraverse()
                })
                function fnTraverse(){
                    let iDocWi = parseInt(document.documentElement.clientWidth)
                    if(iDocWi < 600){
                        let oLi = oTable.getElementsByTagName('li')
                        for(xx of oLi) {
                            fnSquare(xx)
                        }
                    }
                }
                function fnSquare(Obj){
                    let iW = getComputedStyle(Obj,null).getPropertyValue('width')
                    let iWc = (parseInt(iW) >= 70) ? iW : '70px'
                    Obj.style.height = iWc
                    Obj.style.lineHeight = iWc
                }
            })()//封闭函数

            ;(function(){
                
                window.addEventListener('click',()=>{
                    if(iNum > 0){
                        let oGdBox = document.getElementById('gdBox')
                        oGdBox.setAttribute('vi','vi')
                        if(iNum === 25){
                            oTips.style.opacity = 0
                            setTimeout(()=>{
                                oTips.innerText = '我们终将走向同一个终点，但我们的风景独一无二。'
                                oTips.style.opacity = 1
                            },500)
                            
                        }else{
                            // oTips.innerText = iNum
                        }
                    } 
                })
            })()

            document.getElementById('reset').onclick = function(){
                let oLi = oTable.getElementsByTagName('li')
                for(xx of oLi) {
                    xx.setAttribute('z',0)
                }
                iNum = 0
                oTips.innerText = iNum
            }

            ;(function(){
                let iDocWi = parseInt(document.documentElement.clientWidth)
                let iStar = 350
                function fnRan(min,max){
                    let ix = Math.random()*(max - min) + min;
                    function fnx(){
                        let ii = Math.random()
                        if(ii > 0.45){
                            return -1
                        }
                        else{
                            return 1
                        }
                    }
                    return ix*fnx()
                }
                let arr = []
                let oStar = document.getElementById('star')
                if(iDocWi>600){
                    iStar = 800
                }
                for(i = 0 ; i < iStar ; i++){
                    arr[i] = document.createElement('div')
                    arr[i].style.transform = 'translateZ('+ fnRan(0,iDocWi) +'px) '+'translateX('+ fnRan(0,iDocWi) +'px) '+'translateY('+ fnRan(0,iDocWi) +'px) '+'scale('+ Math.random()*2 +')'
                    oStar.appendChild(arr[i])
                }
            })()//star
        }//onload