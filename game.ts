/**
 * 2048游戏的主要逻辑类
 */
class Game2048 {
    private grid: number[][];
    private score: number;
    private bestScore: number;
    private size: number;
    private tileContainer: HTMLElement;
    private scoreElement: HTMLElement;
    private bestScoreElement: HTMLElement;
    private gameMessageElement: HTMLElement;
    private messageTextElement: HTMLElement;

    constructor() {
        this.size = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore') || '0');
        
        this.tileContainer = document.getElementById('tile-container')!;
        this.scoreElement = document.getElementById('score')!;
        this.bestScoreElement = document.getElementById('best-score')!;
        this.gameMessageElement = document.getElementById('game-message')!;
        this.messageTextElement = document.getElementById('message-text')!;
        
        this.init();
    }

    /**
     * 初始化游戏
     */
    private init(): void {
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
    private setupGrid(): void {
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
    private setupEventListeners(): void {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('restart-btn')!.addEventListener('click', () => this.restart());
        document.getElementById('try-again-btn')!.addEventListener('click', () => this.restart());
    }

    /**
     * 处理键盘按键事件
     * @param event - 键盘事件
     */
    private handleKeyPress(event: KeyboardEvent): void {
        if (this.isGameTerminated()) return;

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
            } else if (this.isGameOver()) {
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
    private move(direction: 'up' | 'down' | 'left' | 'right'): boolean {
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
    private moveLeft(): void {
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
    private moveRight(): void {
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
    private moveUp(): void {
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
    private moveDown(): void {
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
    private addRandomTile(): void {
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
    private updateDisplay(): void {
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
    private createTile(value: number, row: number, col: number): void {
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
    private gridsEqual(grid1: number[][], grid2: number[][]): boolean {
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
    private isGameWon(): boolean {
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
    private isGameOver(): boolean {
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
                if (
                    (i > 0 && this.grid[i - 1][j] === current) ||
                    (i < this.size - 1 && this.grid[i + 1][j] === current) ||
                    (j > 0 && this.grid[i][j - 1] === current) ||
                    (j < this.size - 1 && this.grid[i][j + 1] === current)
                ) {
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
    private isGameTerminated(): boolean {
        return this.gameMessageElement.style.display === 'flex';
    }

    /**
     * 显示游戏消息
     * @param message - 消息内容
     * @param className - CSS类名
     */
    private showMessage(message: string, className: string): void {
        this.messageTextElement.textContent = message;
        this.gameMessageElement.className = `game-message ${className}`;
        this.gameMessageElement.style.display = 'flex';
    }

    /**
     * 重新开始游戏
     */
    private restart(): void {
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