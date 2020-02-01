window.onload = function(){
            var oCen = document.getElementById('cen')
            var oTa = document.getElementById('ta')
            var iB = 0
            var iNum = 0
            var aBtn = []
            for(i = 0;i<5;i++){
                aBtn[i] = []
                for(j = 0;j<5;j++){
                    aBtn[i][j] = document.createElement('li')
                    aBtn[i][j].innerHTML = '<p>.</p>'
                    aBtn[i][j].setAttribute('x',i)
                    aBtn[i][j].setAttribute('y',j)
                    aBtn[i][j].setAttribute('z',0)
                    aBtn[i][j].addEventListener('click',function(){
                        var ix = parseInt(this.getAttribute('x')) 
                        var iy = parseInt(this.getAttribute('y')) 
                        if(iB === 0){
                                iB = 1
                                fnTurn(ix,iy)
                                if(ix < 4) fnTurn(ix+1,iy)
                                if(ix > 0) fnTurn(ix-1,iy)
                                if(iy < 4) fnTurn(ix,iy+1)
                                if(iy > 0) fnTurn(ix,iy-1)
                                if(iNum === 25) {
                                    aBtn[2][2].innerHTML = '<p>通关</p>'
                                    aBtn[3][2].innerHTML = '<p>成功！</p>'
                                }else{
                                    aBtn[2][2].innerHTML = '<p>.</p>'
                                    aBtn[3][2].innerHTML = '<p>.</p>'
                                }
                                iB = 0
                            }

                    })
                    oTa.appendChild(aBtn[i][j])
                }
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
                    console.log('resize!')
                    fnTraverse()
                })
                function fnTraverse(){
                    var iDocWi = parseInt(document.documentElement.clientWidth)
                    if(iDocWi < 600){
                        let oLi = oTa.getElementsByTagName('li')
                        for(xx of oLi) {
                            fnSquare(xx)
                        }
                    }
                }
                function fnSquare(Obj){
                    var iW = getComputedStyle(Obj,null).getPropertyValue('width')
                    var iWc = (parseInt(iW) >= 70) ? iW : '70px'
                    Obj.style.height = iWc
                    Obj.style.lineHeight = iWc
                }
            })()
            ;(function(){
                console.log(1)
                let oTaiJi = document.getElementById('taiji')
                   window.addEventListener('click',function(){
                   var iRotate = iNum*7 + 50
                oTaiJi.style.transform = 'rotate('+iRotate+'deg)'
                if(iNum > 0) oCen.style.overflow = 'visible'
                })
            })()
        }//onload