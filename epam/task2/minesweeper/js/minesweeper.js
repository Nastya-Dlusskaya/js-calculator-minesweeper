let width = 8;
let bombCount = 10;
let board;
let time = 0;
let myInterval;

$('document').ready(function () {
    $('#btn-game').on('click', function () {
        document.getElementById('message').innerText = '';
        reset();
        bombCount = $('#number-bomb').val();
        width = Math.ceil(bombCount * 3 / 4);
        document.getElementById('count-bomb').innerText = bombCount;

        let table = document.createElement('table', 'table');
        for (var i = 0; i < width; i++) {
            var r = table.insertRow(i);
            for (var j = 0; j < width; j++) {
                let c = r.insertCell(j);
                c.num = 0;
                c.index = [i, j];
            }
        }

        let placedBombs = bombCount;
        do {
            let hNum = rand(0, width - 1);
            let wNum = rand(0, width - 1);

            if (!table.rows[hNum].cells[wNum].bomb) {
                let cell = table.rows[hNum].cells[wNum];
                cell.num = null;
                cell.bomb = true;
                placedBombs--;
            }
        } while (placedBombs > 0);

        for (let i = 0, len = table.rows.length; i < len; i++) {
            for (let j = 0, len2 = table.rows[i].cells.length; j < len2; j++) {
                if (table.rows[i].cells[j].bomb) {
                    placeNumbers(table, j, i);
                }
            }
        }

        board = table;
        let minefield = document.getElementById('minefield');
        minefield.innerHTML = '';
        minefield.appendChild(table);
    });

    var placeNumbers = function (t, x, y) {
        if (x > 0) {
            t.rows[y].cells[x - 1].num++;
        }

        if (x < width - 1) {
            t.rows[y].cells[x + 1].num++;
        }

        if (x > 0 && y > 0) {
            t.rows[y - 1].cells[x - 1].num++;
        }

        if (y > 0) {
            t.rows[y - 1].cells[x].num++;
        }

        if (y > 0 && x < width - 1) {
            t.rows[y - 1].cells[x + 1].num++;
        }

        if (x > 0 && y < width - 1) {
            t.rows[y + 1].cells[x - 1].num++;
        }

        if (y < width - 1) {
            t.rows[y + 1].cells[x].num++;
        }

        if (x < width - 1 && y < width - 1) {
            t.rows[y + 1].cells[x + 1].num++;
        }
    };

    var rand = function (min, max) {
        min = parseInt(min);
        max = parseInt(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    $(this).on('click', 'table', function () {
        start();
    });

    $(this).on('click', 'td', function () {
        if (!this.bomb) {
            if (this.num > 0) {
                openCell(this);
            } else {
                roll(this.index[1], this.index[0]);
            }
        } else {
            openCell(this);
            document.getElementById('message').innerText = 'You lose';
            gameOver();
            clearInterval(myInterval);
        }

    });

    $(this).on('contextmenu', 'td', function () {
        if (bombCount > 0) {
            if (this.style.backgroundColor === 'salmon') {
                this.style.backgroundColor = '';
                bombCount++;
            } else if (this.style.backgroundColor === '') {
                this.style.backgroundColor = 'salmon';
                bombCount--;
            }
            document.getElementById('count-bomb').innerText = bombCount;

            let table = document.getElementById('minefield');
            for (let i = 0, len = board.rows.length; i < len; i++) {
                for (let j = 0, len2 = board.rows[i].cells.length; j < len2; j++) {
                    if (board.rows[i].cells[j].bomb) {
                        if (table.firstChild.rows[i].cells[j].style.backgroundColor !== 'salmon') {
                            return false;
                        }
                    }
                }
            }
            gameOver();
            document.getElementById('message').innerText = 'You win';
            clearInterval(myInterval);
            return false;
        }

        if (this.style.backgroundColor === 'salmon') {
            this.style.backgroundColor = '';
            bombCount++;
        }
        document.getElementById('count-bomb').innerText = bombCount;
        return false;

    });

    let openCell = function (elem) {
        if (!elem.bomb) {
            if (elem.num > 0) {
                elem.innerHTML = '<b>' + elem.num + '</b>';
            } else {
                elem.style.backgroundColor = 'powderblue';
            }

            switch (elem.num) {
                case 1:
                    elem.style.color = 'blue';
                    break;
                case 2:
                    elem.style.color = 'green';
                    break;
                case 3:
                    elem.style.color = 'red';
                    break;
                case 4:
                    elem.style.color = 'dakrblue';
                    break;
                case 5:
                    elem.style.color = 'pink';
                    break;
                case 6:
                    elem.style.color = 'navy';
                    break;
                case 7:
                    elem.style.color = 'brown';
                    break;
                case 8:
                    elem.style.color = 'grey';
                    break;
                default:
                    elem.style.color = 'black';
            }
        } else {
            elem.innerHTML = '<b>B</b>';
        }
    };

    let gameOver = function () {
        for (let i = 0, len1 = board.rows.length; i < len1; i++) {
            for (var j = 0, len2 = board.rows[i].cells.length; j < len2; j++) {

                openCell(board.rows[i].cells[j]);
            }
        }
    };

    let roll = function (x, y) {
        if (x < 0 || y < 0 || x >= width || y >= width) {
            return;
        }

        openCell(board.rows[y].cells[x]);

        if (board.rows[y].cells[x].num > 0) {
            board.rows[y].cells[x].innerHTML = '<b>' + board.rows[y].cells[x].num + '</b>';
            return;
        }

        if (board.rows[y].cells[x].check) {
            return;
        }

        board.rows[y].cells[x].check = true;

        roll(x + 1, y);
        roll(x - 1, y);
        roll(x, y + 1);
        roll(x, y - 1);
        roll(x - 1, y - 1);
        roll(x + 1, y - 1);
        roll(x - 1, y + 1);
        roll(x + 1, y + 1);
    };

    function start() {
        myInterval = setInterval(function () {
            time++;
            var mins = Math.floor(time/10/60%60);
            var sec = Math.floor(time/10%60);
            var minsec = Math.floor(time%10);
            var hour = Math.floor(time/10/60/60%60);
            if(mins < 10){
                mins = '0' + mins;
            }
            if(sec < 10){
                sec = '0' + sec;
            }
            $("#stopwatch").val(hour+':'+mins+':'+sec+'.'+minsec);
        }, 1);
    }

    function reset() {
        clearInterval(myInterval);
        time=0;
        $('#stopwatch').val('0:00:00.0');
    }
});