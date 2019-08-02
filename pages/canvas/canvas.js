var json=null;
var bofangState;
Page({

 
  data: {
    
  },

  onLoad: function (options) {
    // console.log(options)
    
      json = options.canvas
      json = JSON.parse(json)
    //   JSON.parse(item.wx_json);
    //   console.log(json)
  },

    onShow: function () {
        var self = this;
        self.setData({
            isClick: true
        });
        // bofangState = null;
        this.bofang();
    },
    bofang:function () {
        var self = this;
        if (self.data.isClick) {
            wx.drawCanvas({
                canvasId: 'myCanvas',
                actions: []
            });
            self.setData({
                isClick: false
            });
        }

		// console.log(json)
			var allStroker = [];
        var path = '';
        var temptime;
        var startplay;
        var lineIndex;
        var ctx;
        var currentPage;
        var pointIndex;
        var tempFilePath, innerAudioContext;
        var bofangState;
        var  coverImg;
        var btnFlag;
        // var json = json;

        path = json.path;
        // console.log(path)
        allStroker = JSON.parse(path);
        temptime = json.temptime;



        coverImg = json.coverImg;
        btnFlag= json.flag,
        // bgImg= json.bgImg
			
		tempFilePath = json.mp3;

        if (self.data.isClick) {
            wx.drawCanvas({
                canvasId: 'myCanvas',
                actions: []
            });
            self.setData({
                isClick: false
            });
        }
        var p = allStroker;

        var p2;
        if (!bofangState) {
            if (tempFilePath && wx.createInnerAudioContext) {
                innerAudioContext = wx.createInnerAudioContext();
                innerAudioContext.autoplay = true;
                innerAudioContext.src = tempFilePath;

                bofangState = 1;
            }
        };

        if (!startplay) startplay = (new Date()).getTime();

        if (!lineIndex) lineIndex = 0;

        if (!currentPage) currentPage = 1;

        if (!pointIndex) pointIndex = 0;


        if (!ctx) {
            ctx = wx.createCanvasContext('myCanvas');
            ctx.beginPath();
        };
        var timer=null;
        timer = setInterval(function () {
            var t = (new Date()).getTime() - startplay;

            if (t >= temptime) {
                clearInterval(timer);

                if (currentPage == p.length) {
                    lineIndex = pointIndex = currentPage = startplay = '';
                    self.setData({
                        isClick: true
                    });
                    bofangState = null;
                }
                return;
            } else {
                p2 = p[currentPage - 1];
                var p2Path = p2.curStrokerPath;

                if (lineIndex < p2Path.length) {
                    var curLine = p2Path[lineIndex].lineWidth,
                        curColor = p2Path[lineIndex].color,
                        p3 = p2Path[lineIndex].path[pointIndex];


                    if (p2Path[lineIndex].newpage == 0) {
                        if (p2Path[lineIndex].state == 1) {
                            if (!p3) {
                                if (lineIndex < p2Path.length - 1) {
                                    lineIndex++;
                                    if (currentPage != p.length && pointIndex != p2Path.length - 1) {
                                        clearInterval(timer);

                                        self.bofang();
                                    }
                                    pointIndex = 0;

                                    return;
                                }
                            } else {
                                if (t >= p3.timer) {
                                    if (pointIndex == 0) {
                                        ctx.moveTo(p3.x, p3.y);
                                    }
                                    ctx.lineTo(p3.x, p3.y);
                                    ctx.setStrokeStyle(curColor);
                                    ctx.setLineWidth(curLine);
                                    ctx.setLineCap('round');
                                    ctx.stroke();
                                    ctx.draw(true);
                                    pointIndex = pointIndex + 1;
                                    ctx.beginPath();
                                    ctx.moveTo(p3.x, p3.y);
                                }
                            }
                        } else {
                            // 撤销
                            var a = p2Path;
                            var t = (new Date()).getTime() - startplay;
                            if (t >= a[lineIndex].timer && p2Path[lineIndex].show == 0) {

                                clearInterval(timer);

                                wx.drawCanvas({
                                    canvasId: 'myCanvas',
                                    actions: []
                                });

                                for (var i = 0; i <= lineIndex; i++) {
                                    var temp = a[i];
                                    if (a[lineIndex].lineId == temp.lineId) {
                                        temp.clear = 1;
                                    }
                                    if (a[lineIndex].lineId > temp.lineId && temp.state == 1 && temp.clear == 0) {
                                        for (var j = 0; j < temp.path.length; j++) {
                                            ctx.beginPath();
                                            var obj1 = temp.path[j];
                                            var obj2;
                                            if (j == temp.path.length - 1) {
                                                obj2 = temp.path[j];
                                            } else {
                                                obj2 = temp.path[j + 1];
                                            }
                                            ctx.moveTo(obj1.x, obj1.y);
                                            ctx.lineTo(obj2.x, obj2.y);
                                            ctx.setLineWidth(temp.lineWidth)
                                            ctx.setStrokeStyle(temp.color);
                                            ctx.setLineCap('round');
                                            ctx.stroke();
                                            ctx.draw(true);
                                        }
                                    }
                                }
                                a[lineIndex].clear = 1;
                                pointIndex = 0;
                                if (lineIndex < a.length) {
                                    lineIndex++;
                                }

                                self.bofang();
                                return;
                            }
                        };
                    } else {
                        // 下一页
                        if (t >= p2Path[lineIndex].timer) {
                            clearInterval(timer);

                            wx.drawCanvas({
                                canvasId: 'myCanvas',
                                actions: []
                            });
                            currentPage++;
                            lineIndex = pointIndex = 0;
                            self.bofang();
                            return;
                        }
                    }
                }
            }


        }, 10);



        
    }	
  
})