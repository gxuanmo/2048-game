/**
 * 2048游戏的主要逻辑类
 */
class Game2048 {
    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore') || '0');
        this.tileContainer = document.getElementById('tile-container');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameMessageElement = document.getElementById('game-message');
        this.messageTextElement = document.getElementById('message-text');
        this.init();
    }
    /**
     * 初始化游戏
     */
    init() {
        this.setupGrid();
        this.updateDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.setupEventListeners();
    }
    /**
     * 设置游戏网格
     */
    setupGrid() {
        this.grid = [];
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = 0;
            }
        }
    }
    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // 按钮点击事件
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('try-again-btn').addEventListener('click', () => this.restart());
        
        // 触摸事件支持
        this.setupTouchEvents();
    }
    
    /**
     * 设置触摸事件处理
     */
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        const minSwipeDistance = 30; // 最小滑动距离
        
        const gameContainer = document.querySelector('.game-container');
        
        // 触摸开始
        gameContainer.addEventListener('touchstart', (e) => {
            if (this.isGameTerminated()) return;
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            
            // 防止页面滚动
            e.preventDefault();
        }, { passive: false });
        
        // 触摸移动（防止页面滚动）
        gameContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // 触摸结束
        gameContainer.addEventListener('touchend', (e) => {
            if (this.isGameTerminated()) return;
            
            const touch = e.changedTouches[0];
            endX = touch.clientX;
            endY = touch.clientY;
            
            this.handleSwipe(startX, startY, endX, endY, minSwipeDistance);
            
            // 防止页面滚动
            e.preventDefault();
        }, { passive: false });
        
        // 鼠标事件支持（用于桌面端拖拽）
        let isMouseDown = false;
        
        gameContainer.addEventListener('mousedown', (e) => {
            if (this.isGameTerminated()) return;
            
            isMouseDown = true;
            startX = e.clientX;
            startY = e.clientY;
            
            e.preventDefault();
        });
        
        gameContainer.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
        });
        
        gameContainer.addEventListener('mouseup', (e) => {
            if (!isMouseDown || this.isGameTerminated()) return;
            
            isMouseDown = false;
            endX = e.clientX;
            endY = e.clientY;
            
            this.handleSwipe(startX, startY, endX, endY, minSwipeDistance);
            
            e.preventDefault();
        });
        
        // 防止鼠标离开时卡住
        gameContainer.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
    }
    
    /**
     * 处理滑动手势
     * @param startX - 开始X坐标
     * @param startY - 开始Y坐标
     * @param endX - 结束X坐标
     * @param endY - 结束Y坐标
     * @param minDistance - 最小滑动距离
     */
    handleSwipe(startX, startY, endX, endY, minDistance) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // 检查是否达到最小滑动距离
        if (Math.max(absDeltaX, absDeltaY) < minDistance) {
            return;
        }
        
        let moved = false;
        
        // 判断滑动方向（优先处理较大的位移）
        if (absDeltaX > absDeltaY) {
            // 水平滑动
            if (deltaX > 0) {
                moved = this.move('right');
            } else {
                moved = this.move('left');
            }
        } else {
            // 垂直滑动
            if (deltaY > 0) {
                moved = this.move('down');
            } else {
                moved = this.move('up');
            }
        }
        
        // 处理移动后的游戏状态
        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            if (this.isGameWon()) {
                this.showMessage('你赢了！', 'game-won');
            } else if (this.isGameOver()) {
                this.showMessage('游戏结束！', 'game-over');
            }
        }
    }
    /**
     * 处理键盘按键事件
     * @param event - 键盘事件
     */
    handleKeyPress(event) {
        if (this.isGameTerminated())
            return;
        let moved = false;
        switch (event.key) {
            case 'ArrowUp':
                moved = this.move('up');
                break;
            case 'ArrowDown':
                moved = this.move('down');
                break;
            case 'ArrowLeft':
                moved = this.move('left');
                break;
            case 'ArrowRight':
                moved = this.move('right');
                break;
            default:
                return;
        }
        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            if (this.isGameWon()) {
                this.showMessage('你赢了！', 'game-won');
            }
            else if (this.isGameOver()) {
                this.showMessage('游戏结束！', 'game-over');
            }
        }
        event.preventDefault();
    }
    /**
     * 移动方块
     * @param direction - 移动方向
     * @returns 是否成功移动
     */
    move(direction) {
        const previousGrid = this.grid.map(row => [...row]);
        switch (direction) {
            case 'left':
                this.moveLeft();
                break;
            case 'right':
                this.moveRight();
                break;
            case 'up':
                this.moveUp();
                break;
            case 'down':
                this.moveDown();
                break;
        }
        return !this.gridsEqual(previousGrid, this.grid);
    }
    /**
     * 向左移动
     */
    moveLeft() {
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row[j + 1] = 0;
                }
            }
            const newRow = row.filter(val => val !== 0);
            this.grid[i] = newRow.concat(new Array(this.size - newRow.length).fill(0));
        }
    }
    /**
     * 向右移动
     */
    moveRight() {
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row[j - 1] = 0;
                }
            }
            const newRow = row.filter(val => val !== 0);
            this.grid[i] = new Array(this.size - newRow.length).fill(0).concat(newRow);
        }
    }
    /**
     * 向上移动
     */
    moveUp() {
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column[i + 1] = 0;
                }
            }
            const newColumn = column.filter(val => val !== 0);
            for (let i = 0; i < this.size; i++) {
                this.grid[i][j] = newColumn[i] || 0;
            }
        }
    }
    /**
     * 向下移动
     */
    moveDown() {
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column[i - 1] = 0;
                }
            }
            const newColumn = column.filter(val => val !== 0);
            for (let i = 0; i < this.size; i++) {
                this.grid[i][j] = newColumn[this.size - 1 - i] || 0;
            }
        }
    }
    /**
     * 添加随机方块
     */
    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ x: i, y: j });
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    /**
     * 更新显示
     */
    updateDisplay() {
        this.tileContainer.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    this.createTile(this.grid[i][j], i, j);
                }
            }
        }
        this.scoreElement.textContent = this.score.toString();
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore.toString());
        }
        this.bestScoreElement.textContent = this.bestScore.toString();
    }
    /**
     * 创建方块元素
     * @param value - 方块值
     * @param row - 行位置
     * @param col - 列位置
     */
    createTile(value, row, col) {
        const tile = document.createElement('div');
        tile.className = `tile tile-${value}`;
        tile.textContent = value.toString();
        // 网格单元格尺寸：110px × 110px
        // 水平间距：单元格宽度 + 右边距 = 110px + 10px = 120px
        // 垂直间距：单元格高度 + 下边距 = 110px + 10px = 120px
        // 注意：最后一列没有右边距，最后一行没有下边距
        // 但由于CSS中grid-row有margin-bottom: 10px（除了最后一行），
        // 所以每行之间的实际间距确实是120px
        const x = col * 120;
        const y = row * 120;
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
        this.tileContainer.appendChild(tile);
    }
    /**
     * 检查两个网格是否相等
     * @param grid1 - 第一个网格
     * @param grid2 - 第二个网格
     * @returns 是否相等
     */
    gridsEqual(grid1, grid2) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (grid1[i][j] !== grid2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * 检查游戏是否获胜
     * @returns 是否获胜
     */
    isGameWon() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * 检查游戏是否结束
     * @returns 是否结束
     */
    isGameOver() {
        // 检查是否有空格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        // 检查是否有可合并的方块
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                if ((i > 0 && this.grid[i - 1][j] === current) ||
                    (i < this.size - 1 && this.grid[i + 1][j] === current) ||
                    (j > 0 && this.grid[i][j - 1] === current) ||
                    (j < this.size - 1 && this.grid[i][j + 1] === current)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * 检查游戏是否终止
     * @returns 是否终止
     */
    isGameTerminated() {
        return this.gameMessageElement.style.display === 'flex';
    }
    /**
     * 显示游戏消息
     * @param message - 消息内容
     * @param className - CSS类名
     */
    showMessage(message, className) {
        this.messageTextElement.textContent = message;
        this.gameMessageElement.className = `game-message ${className}`;
        this.gameMessageElement.style.display = 'flex';
    }
    /**
     * 重新开始游戏
     */
    restart() {
        this.score = 0;
        this.gameMessageElement.style.display = 'none';
        this.gameMessageElement.className = 'game-message';
        this.setupGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }
}
// 当页面加载完成时启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
