
Component({
    properties: {
        item: {
            type: Object,
            value: {},
            observer: function (oldVal, newVal) {
                // console.log(newVal,'===', oldVal);
                
            }
        }
    },
    data: {
        count: 0,
        length: 0
    },
    methods: {
        modiHeight: function () {
            var count = this.data.count;
            count++;
            this.setData({
                count: count
            });
        },
        getLength: function(str){
            return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  
        }
    },
    ready: function () {
        var a = this.getLength(this.data.item.content);
        this.setData({
            count: 0,
            length: a
        });
    },
    detached: function () {
        this.setData({
            count: 0
        });
    }
})