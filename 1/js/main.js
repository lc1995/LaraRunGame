var game = new Phaser.Game(320, 505, Phaser.AUTO, 'game_div');


game.States = {};
//boot场景,加载进度条
game.States.boot = function(){
    this.preload = function(){
    	if(!game.device.desktop){//移动设备适应
			this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
			this.scale.forcePortrait = true;
			this.scale.refresh();
		}
        game.load.image('loading','assets/preloader.gif'); //加载进度条图片资源
    };
    this.create = function(){
        game.state.start('preload'); //加载完成后，调用preload场景
    };
}
//preload场景，加载资源
game.States.preload = function(){
    this.preload = function(){
        var preloadSprite = game.add.sprite(50,game.height/2,'loading'); //创建显示loading进度的sprite
        //game.load.setPreloadSprite(preloadSprite);  //用setPreloadSprite方法来实现动态进度条的效果
        
        //以下为要加载的资源
        game.load.image('background','assets/lara_run_bgsky.png'); //游戏背景图
        game.load.image('ground','assets/ground.png'); //地面
        game.load.image('title','assets/title.png'); //游戏标题
        game.load.spritesheet('lara','assets/bird.png',34,24,3); //lara
        game.load.image('btn','assets/start-button.png');  //按钮
        game.load.spritesheet('pipe','assets/pipes.png',54,320,2); //管道
        game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        game.load.audio('fly_sound', 'assets/flap.wav');//飞翔的音效
        game.load.audio('score_sound', 'assets/score.wav');//得分的音效
        game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
        game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效

        game.load.image('ready_text','assets/get-ready.png'); //get ready图片
        game.load.image('play_tip','assets/instructions.png'); //玩法提示图片
        game.load.image('game_over','assets/gameover.png'); //gameover图片
        game.load.image('score_board','assets/scoreboard.png'); //得分板
    }
    this.create = function(){
        game.state.start('menu'); //当以上所有资源都加载完成后就可以进入menu游戏菜单场景了
    }
}
//menu，游戏菜单
game.State.menu = function(){
	this.create = function(){
		var bg = game.add.TileSprite(0,0,game.width,game.height,'background');
		bg.autoScroll(-20,0);
		var titleGroup = game.add.group();
		titleGroup.create(0,0,'title');//标题
		var lara = titleGroup.create(90, 160, 'lara');
		lara.animations.add('run');//给lara添加动画
		lara.animations.play('run', 12, true);//播放动画
		titleGroup.x = 35; //调整组的水平位置
        titleGroup.y = 100; //调整组的垂直位置
        game.add.tween(titleGroup).to({ x:120 },1000,null,true,0,Number.MAX_VALUE,true); //对这个组添加一个tween动画，让它不停的左右移动
        var btn = game.add.button(game.width/2,game.height/2,'btn',function(){//添加一个按钮
            game.state.start('play'); //点击按钮时跳转到play场景
        });
        btn.anchor.setTo(0.5,0.5); //设置按钮的中心点
	}
	
}
//play，正式开始
game.State.play = function(){
	
}

//把定义好的场景添加到游戏中
game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload); 
game.state.add('menu',game.States.menu); 
game.state.add('play',game.States.play);

//调用boot场景来启动游戏
game.state.start('boot');