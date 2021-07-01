const week = document.getElementById('week');


const rotateLeft = a => a.push(a.shift());
const rotateRight = a => a.unshift(a.pop());
const repeat = n => f => {for (let i=0; i<n; i++) f()};


document.addEventListener('readystatechange', event => { 
  if (event.target.readyState === "complete") {
    const app = new Vue({
      el: '#app',
      data: {
        startTasks: ["Toalett/sopor", "Köket", "Hall", "Vardagsrum", "Tvättstuga", "Badrum"],
        week: parseInt(document.getElementById('week').value),
        people: ["Johannes", "Lorenzo", "Saranna", "Alex", "Sebastian", "Ellen"],
      },
      computed: {
        tasks: function () {
          const yearDiff = (new Date().getFullYear() - 2021) * 52;
          const a = this.startTasks.map(t => t);
          repeat(this.week + yearDiff)(() => rotateLeft(a));
          return a;
        },
        tasksAndPeople: function() {
            const a = [];
            this.tasks.forEach((t, i) => {
              a.push(this.people[i]);
              a.push(t);
            });
            return a;
        }
      },
      methods: {
        left: function () {
          if (this.week === 1)
            this.week = 52;
          else
            this.week = this.week -= 1;
        },
        right: function () {
          if (this.week === 52)
            this.week = 1;
          else
            this.week = this.week += 1;
        }
      }
    });
    document.getElementById('app').style.display = 'block';
    document.getElementsByTagName('video')[0].play();
  }
});
