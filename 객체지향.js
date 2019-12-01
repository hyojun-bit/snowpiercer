Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}

Game.setGameoverMessage = function(){
	game.setGameoverMessage("꼬리칸의 반란은 허무하게 끝나고 말았다...")
}

Game.combination = function(combination1, combination2, result) {
    game.makeCombination(combination1.id, combination2.id, result.id)
}

Game.setTimer = function() {
    game.setTimer("10", "1", "초")
}

Game.hideTimer = function() {
	game.hideTimer()


}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

Object.member('isHanded', function(){
	return Game.handItem() == this.id
})



//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})


//////// Box Definition
function Box(room, name, closedImage, openedImage){
    Object.call(this, room, name, closedImage)
 
    // Box properties
    this.closedImage = closedImage
    this.openedImage = openedImage
 }
 // inherited from Object
 Box.prototype = new Object()
 
 Box.member('onClick', function() {
    if(this.id.isClosed()) {
       this.id.open()
    } else if(this.id.isOpened()) {
       this.id.close()
    }
 })
 Box.member('onOpen', function() {
    this.id.setSprite(this.openedImage)
 })
 Box.member('onClose', function() {
    this.id.setSprite(this.closedImage)
 })




///////////////////////////////////
////////////////////////////////
//////////////////////////////////


unclearroom = new Room('unclearroom', '흔들리는배경.png')
frontroom = new Room('frontroom', '윌포드전방.jpg')
lastroom = new Room('lastroom', '배경112.png')
enginroom = new Room('enginroom', '엔진룸.png')	
endroom = new Room('endroom', '불난방.png')		

//흔들리는 배경

//박스
unclearroom.box = new Box(unclearroom, "box", "상자3-닫힘.png",'상자3-열림.png')
unclearroom.box.resize(130) 
unclearroom.box.locate(880, 590)
unclearroom.box.onClick = function() {

	if(this.id.isOpened()){
		this.id.close()
		unclearroom.pill.hide()
	} 
	else if (this.id.isClosed()){
		this.id.open()
        unclearroom.pill.show()
	printMessage("상자 속에 무언가가 있다!")
}
}


//약
unclearroom.pill = new Item(unclearroom, "pill", "약.png")
unclearroom.pill.resize(90) 
unclearroom.pill.locate(880, 590)
unclearroom.pill.hide()
unclearroom.pill.onClick = function() {
	Game.move(frontroom)
	unclearroom.pill.hide()
	unclearroom.box.hide()
	printMessage("해독제를 먹으니 정신이 드네..")
}


//마지막전방
playSound("마지막방노래.wav")



//아이디카드
frontroom.key1 = new Object(frontroom, 'key1', '비서_아이디카드.png')
frontroom.key1.resize(75)
frontroom.key1.locate(700, 550)
frontroom.key1.hide()
frontroom.key1.onClick = function(){
	frontroom.key1.pick()
	printMessage("비서전용 ID카드를 얻었다.");
}


//검은상자-다시 안닫히는 상자
frontroom.blackbox = new Object(frontroom, 'blackbox', '상자2-1-닫힘.png')
frontroom.blackbox.resize(105)
frontroom.blackbox.locate(430, 540)
frontroom.blackbox.onClick = function() {
 if (frontroom.bat.isHanded()){
	playSound("퍽!.wav")

		this.id.setSprite('상자2-1-열림.png')
        frontroom.san.show()
	printMessage("상자 뚜껑을 날렸다!")	
}
else {printMessage("묵직한게 들어 있지만 뚜껑이 열리지 않는다")}
}



//검은상자2
frontroom.blackbox2 = new Box(frontroom, 'blackbox2', '상자2-1-닫힘.png','상자2-1-열림.png')
frontroom.blackbox2.resize(105)
frontroom.blackbox2.locate(375, 600)
frontroom.blackbox2.onClick = function() {

	if(this.id.isOpened()){
		this.id.close()
	} 
	else if (this.id.isClosed()){
		this.id.open()
	printMessage("빈 박스다.")
}
}

//검은상자3
frontroom.blackbox3 = new Box(frontroom, 'blackbox3', '상자2-1-닫힘.png','상자2-1-열림.png')
frontroom.blackbox3.resize(95)
frontroom.blackbox3.locate(470, 470)
frontroom.blackbox3.onClick = function() {

	if(this.id.isOpened()){
		this.id.close()
	} 
	else if (this.id.isClosed()){
		this.id.open()
	printMessage("아무것도 없다")
}
}

//산화제+압력용기

frontroom.com_san_press = new Item(frontroom, 'com_san_press', '산화제와용기.png')
frontroom.com_san_press.hide()


//산화제
frontroom.san = new Object(frontroom, 'san', '산화제.png')
frontroom.san.resize(85)
frontroom.san.locate(432, 540)
frontroom.san.hide()
frontroom.san.onClick = function(){
	frontroom.san.pick()
	printMessage("산화제를 주웠다.")
}

//압력용기
frontroom.press = new Object(frontroom, 'press', '압력용기.png')
frontroom.press.resize(85)
 frontroom.press.locate(805, 490)
frontroom.press.onClick = function() {
	if(frontroom.redbull.isHanded()){
		frontroom.press.pick()
		printMessage("레드불의 힘으로 큰 용기를 담았다!")
	}
	else{printMessage("너무 무거워서 들 수가 없다.")}
	
}

Game.combination(frontroom.san, frontroom.press, frontroom.com_san_press)


//총
frontroom.gun = new Object(frontroom, 'gun', '권총.png')
frontroom.gun.resize(55)
frontroom.gun.locate(769, 550)
frontroom.gun.hide()
 frontroom.gun.onClick = function(){
 	frontroom.gun.pick()
 	printMessage("총알이 없는 총을 주웠다.")
}


//선반
frontroom.shelter = new Object(frontroom, 'shelter', '선반열차.png')
frontroom.shelter.resize(205)
frontroom.shelter.locate(175, 500)


//방망이
frontroom.bat = new Object(frontroom, 'bat', '방망이.png')
frontroom.bat.resize(155)
frontroom.bat.locate(175, 500)
frontroom.bat.onClick = function(){
	frontroom.bat.pick()
	printMessage("방망이를 주웠다. \n 여기저기 요긴하게 쓸 것 같다.")

}

//방패
frontroom.armour = new Object(frontroom, 'armour', '방패.png')
frontroom.armour.resize(165)
frontroom.armour.locate(175, 400)
frontroom.armour.onClick = function(){
	frontroom.armour.pick()
	printMessage("방패를 주웠다. \n 총을 막을 수 있을 만큼 강해보인다.")

}


//전화기
frontroom.phone = new Object(frontroom, "phone", "전화기-오른쪽-1.png")
frontroom.phone.resize(30)
frontroom.phone.locate(800, 298)
var Phoneclick = 0
frontroom.phone.onClick = function() {
	if(Phoneclick == 0){
	playSound("전화신호음1.wav")
	printMessage("신호는 가는데 응답이 없네. 한번 더 눌러보자!")
	Phoneclick +=1
	}

	else if(Phoneclick == 1){
		frontroom.phone.setSprite('전화기-오른쪽-2.png')
		playSound("비서_안녕.wav")
		printMessage("10초 안에 방패를 줍고\n 비서를 클릭해서 총알을 막아라!")
		frontroom.woman_s.show()
		Game.setTimer()
		Phoneclick +=1


}
}


//비서
frontroom.woman_s = new Object(frontroom, "woman_s", "그냥비서.png") 
frontroom.woman_s.resize(130)
frontroom.woman_s.locate(700, 450) 
frontroom.woman_s.hide()
var Womanclick=0
frontroom.woman_s.onClick = function(){
	if(Womanclick==0 && frontroom.armour.isHanded()){
		Game.hideTimer()
		playSound("총두발.wav")
		printMessage("방패로 막다니..!")
		Womanclick+=1
	}

	else if(frontroom.bat.isHanded()){
		playSound("퍽!.wav")
		printMessage("방망이로 기절시켰다!")
		frontroom.woman_s.setSprite('죽은비서1.png')
		frontroom.key1.show()
		frontroom.gun.show()

	}
	else if(Womanclick==0) {
		printMessage("방패 없이 총을 맞았다.. 시야가 점점 흐려진다")
		playSound("총두발.wav")
		Game.move(unclearroom)
}
	else if(Womanclick>=1 && frontroom.armour.isHanded()){
		printMessage("내가 있는 한 윌포드님 방에 들어갈 수 없다!")
	}
}

//레드불
frontroom.redbull = new Object(frontroom, "redbull", "레드불.png")
frontroom.redbull.resize(60) 
frontroom.redbull.locate(120, 490)
frontroom.redbull.onClick = function() {
	frontroom.redbull.pick()
printMessage("레드불을 주웠다.")
}


//상자
frontroom.box = new Object(frontroom, "box", "상자3-열림.png")
frontroom.box.resize(130) 
frontroom.box.locate(880, 590)
frontroom.box.onClick = function() {
	printMessage("약을 꺼냈던 상자다.")
}


//고아성마지막
frontroom.goa = new Object(frontroom, "goa", "고아성마지막.png")
frontroom.goa.resize(100) 
frontroom.goa.locate(430, 540)
frontroom.goa.hide()
frontroom.goa.onClick = function() {
	printMessage("여기 문에 폭탄을 붙이고 성냥을 켜요!")
}

//폭탄자리
frontroom.bombplace = new Object(frontroom, "bombplace", "가상문22.png")
frontroom.bombplace.resize(80) 
frontroom.bombplace.locate(310, 390)
frontroom.bombplace.onClick = function() {
	if(enginroom.krobomb.isHanded()){
	printMessage("폭탄을 붙였다!")
	frontroom.doorbomb.show()
}
else if(enginroom.krobomb.isPicked()){
	printMessage("여기 폭탄을 붙이면 될 것 같다.")
}
	else{printMessage("심상치 않은 문이다.")}
}

//폭탄붙이기용
frontroom.doorbomb = new Object(frontroom, "doorbomb", "크로놀폭탄.png")
frontroom.doorbomb.resize(100) 
frontroom.doorbomb.locate(330, 390)
frontroom.doorbomb.hide()
frontroom.doorbomb.onClick = function() {
	if(lastroom.fire.isHanded()){
		playSound("폭발음.wav")
		frontroom.bombbomb.show()
		frontroom.doorbomb.hide()
		frontroom.goa.hide()

		printMessage("뻥!")
}
}

//폭발
frontroom.bombbomb = new Object(frontroom, "bombbomb", "폭발빵.png")
frontroom.bombbomb.resize(500) 
frontroom.bombbomb.locate(300, 390)
frontroom.bombbomb.hide()
frontroom.bombbomb.onClick = function() {
	playSound('불방.wav')
	Game.move(endroom)}


//마지막게임끝
endroom.door = new Object(endroom, "door", "가상문22.png")
endroom.door.resize(80) 
endroom.door.locate(310, 390)
endroom.door.onClick = function() {
	showImageViewer('눈.jpg',"")
	playSound("마지막음악.wav")
	Game.end()}





//윌포드문양키패드

frontroom.markpad = new Keypad(frontroom, "markpad", '윌포드문양.png', "8622", function(){
    frontroom.door1.unlock()
	printMessage("비밀번호 일치, 카드를 대고 문을 여세요.")
})
frontroom.markpad.resize(50);
frontroom.markpad.locate(700, 290)
frontroom.markpad.onClick = function() {
	if (frontroom.door1.isLocked()) {
		printMessage("암호를 입력하시오.");
		showKeypad("telephone", this.password, this.callback)
	} else {
		printMessage("문을 열고 들어오세요.")
	}
}


//문
frontroom.door1 = new Door(frontroom, 'door1', '윌포드전방-문닫힘.png', '윌포드전방-문열림.png', lastroom)
frontroom.door1.resize(173)
frontroom.door1.locate(580, 300)
frontroom.door1.lock()
frontroom.door1.onClick = function(){

	if (frontroom.key1.isHanded() && !this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		printMessage("승인되었습니다.")
	}


	else if (this.id.isOpened()){
		
			Game.move(this.connectedTo)
		}

	else if(this.id.isLocked())
		{printMessage("윌포드의 방인듯 하다.")
	}

	else {printMessage("승인된 카드를 대고 문을 열어주세요.")
		}
	}






//마지막 방


//카페트
lastroom.carpet = new Object(lastroom,"carpet", "carpet.png")
lastroom.carpet.resize(100)
lastroom.carpet.locate(460, 520)


//다음버튼
lastroom.button = new Object(lastroom,"button", "다음.png")
lastroom.button.resize(190)
lastroom.button.locate(1180, 500)

//스토리
var buttonClick = 0
lastroom.button.onClick = function() {
    if(buttonClick == 0){
		printMessage("윌포드 : \"오 카터스! 반갑네.\"")
		playSound("카디스부르기.wav")
        buttonClick += 1
    } else if(buttonClick == 1){
		playSound("엔진내놔.wav")

        printMessage("카터스 : \"우린 엔진을 차지하러 왔다.\"")
        buttonClick += 1
    } else if(buttonClick == 2){
		playSound("자리가있다네.wav")

        printMessage("윌포드 : \"세상엔 질서라는 것이 있네. 각자의 위치가 있는법이지\"")
        buttonClick += 1
    } else if(buttonClick == 3){
		playSound("높은놈들이하는말.wav")

        printMessage("카터스 : \"가장 위에 있는 놈들이 늘 하는 말이지.\"")
		buttonClick += 1
	}

	else if(buttonClick == 4){
		playSound("이자리너할래.wav")

        printMessage("윌포드 : \"카디스, 사실 너에게 이 자리를 주려고했네.\"")
        buttonClick += 1
	}
	
	else if(buttonClick == 5){
		playSound("카터스_뭐라고.wav")

        printMessage("카터스 : \"뭐라고?\"")
        buttonClick += 1
	}

	else if(buttonClick == 6){
		playSound("윌포드_이리오게나.wav")

		printMessage("윌포드 : \"가서 저 엔진을 한 번 느껴보게.\"")
		buttonClick += 1
	}

	else if(buttonClick == 7){
		lastroom.ford.id.moveX(-500) //윌포드 옮기기
		lastroom.ford.id.moveY(-2)
		lastroom.ford.resize(140)
		printMessage("카터스 : (머뭇 머뭇)")
		buttonClick += 1
	}

	else if(buttonClick == 8){
		
		playSound("윌포드_컴언.wav")

		printMessage("윌포드 : \"어서\"")
		buttonClick += 1
	}
	else if(buttonClick == 9){
		lastroom.catis.show()

		showVideoPlayer("엔진을느끼다.mp4")
		buttonClick += 1
}

	else if(buttonClick == 10){
		playSound("니운명이야.wav")

        printMessage("윌포드 : \"너가 다음번 엔진의 주인일세.\"")
		buttonClick += 1
}
	else if(buttonClick == 11){
		lastroom.button.hide()
		playSound("총쏘는고아성.wav")
		printMessage("고아성 : \"카티스 우린 여길 나가야해요!\"")
		lastroom.ford.setSprite('윌포드_죽음.png')
		lastroom.catis.setSprite('카티스앞모습.png')
		lastroom.catis.id.moveY(50)
		lastroom.littlegirl.show()
		lastroom.keys.show()
		lastroom.bullet.show()

}
}


//돌아가기
lastroom.arrow = new Object(lastroom,"arrow", "돌아가기.png")
lastroom.arrow.resize(100)
lastroom.arrow.locate(320, 600)
lastroom.arrow.hide()
lastroom.arrow.onClick = function()
{Game.move(frontroom)
printMessage("이 문에 폭탄을 붙이고 터뜨리면 돼요!")}


//총알
lastroom.bullet = new Object(lastroom,"bullet", "총알.png")
lastroom.bullet.resize(35)
lastroom.bullet.locate(540, 570)
lastroom.bullet.hide()
lastroom.bullet.onClick = function() {
 	lastroom.bullet.pick()
printMessage("총알을 주웠다.")
}

//열쇠
lastroom.keys = new Object(lastroom,"keys", "key.png")
lastroom.keys.resize(35)
lastroom.keys.locate(569, 560)
lastroom.keys.hide()
lastroom.keys.onClick = function() {
	lastroom.keys.pick()
printMessage("열쇠를 주웠다.")
}

//책상
lastroom.table = new Object(lastroom,"table", "테이블2-2.png")
lastroom.table.resize(165)
lastroom.table.locate(769, 560)

//책
lastroom.books = new Object(lastroom,"books", "책2-2.png")
lastroom.books.resize(75)
lastroom.books.locate(769, 500)
var Bookclick=0
lastroom.books.onClick = function()
{
	if(Bookclick==0){printMessage("책 속에 무언가가 있는 것 같다. \n 좀 더 자세히 뒤져보자!")
Bookclick+=1}

	else if(Bookclick>=1){showImageViewer("윌포드일기.png", "")
	printMessage("암호가 한국어로 되어 있다. \n한국인에게 물어봐야 할 것 같은데.")
}
}


//고아성
lastroom.littlegirl = new Object(lastroom,"littlegirl", "고아성.png")
lastroom.littlegirl.resize(150)
lastroom.littlegirl.locate(100, 630)
lastroom.littlegirl.hide()
lastroom.littlegirl.onClick = function()
{
	if(Bookclick>=1){printMessage("한글 순서에 따라 번호가 있어요!")
	showImageViewer("한글순서.png", "")}
else if(Bookclick==0){printMessage("성냥을 찾아서 나가야해요!")}
}




//서랍
lastroom.drawer = new Box(lastroom,"drawer", "서랍-닫힘.png","서랍-열림.png")
lastroom.drawer.resize(135)
lastroom.drawer.locate(239, 590)
lastroom.drawer.lock()
lastroom.drawer.onClick = function()
{
	if(lastroom.keys.isHanded()&&this.id.isLocked())
	{	this.id.unlock()
		printMessage("서랍장이 열렸다!")
}

else if(this.id.isOpened()){
	this.id.close()
	lastroom.fire.hide()

} 
else if (this.id.isClosed()){
	this.id.open()
	lastroom.fire.show()

}

else{printMessage("서랍장이 단단히 잠겨있다.")}
}


//성냥
lastroom.fire = new Object(lastroom,"fire", "성냥.png")
lastroom.fire.resize(35)
lastroom.fire.locate(267, 580)
lastroom.fire.hide()
lastroom.fire.onClick = function() {
	lastroom.fire.pick()
printMessage("성냥을 주웠다.")
}

//엔진
lastroom.engine = new Door(lastroom,"engine", "엔진.png", "엔진끔.png",enginroom)
lastroom.engine.resize(250)
lastroom.engine.locate(640, 390)
lastroom.engine.lock()
lastroom.engine.onClick = function()
{
	if(this.id.isLocked()){
	printMessage("멈추지 않는 엔진을 꺼야한다.")
}
else if(this.id.isOpened()){
	Game.move(this.connectedTo)
	printMessage("윌포드의 물건들이 들어있다.")
}
}
lastroom.engine.onUnlock = function() {
    lastroom.engine.open()
	printMessage("엔진이 멈췄다.")

}



// 엔진잠금장치
lastroom.enginekeypad = new Keypad(lastroom, "enginekeypad", '윌포드키패드.png', "8191312", function(){
	lastroom.engine.unlock()
	playSound("엔진멈춤.wav")
	printMessage("엔진 수동가동으로 변경")
})
lastroom.enginekeypad.resize(50);
lastroom.enginekeypad.locate(790, 400)
lastroom.enginekeypad.onClick = function() {
	if (lastroom.engine.isLocked()) {
		printMessage("엔진을 멈추기 위한 암호는?");
		showKeypad("telephone", this.password, this.callback)
	} else {
		printMessage("엔진이 멈췄습니다.")
	}
}




//윌포드
lastroom.ford = new Object(lastroom, "ford", "윌포드휠체어.png") // 
lastroom.ford.resize(180) // 크기 조절
lastroom.ford.locate(950, 490) // 
lastroom.ford.onClick = function(){
 if (buttonClick==11){
	printMessage("윌포드의 주머니에서 무언가를 찾았다!")
 }
 else{	printMessage("환영하네 카티스!")
}
}


//카티스
lastroom.catis = new Object(lastroom, "catis", "카티스뒷모습.png") // 
lastroom.catis.resize(80) // 크기 조절
lastroom.catis.locate(650, 470) // 
lastroom.catis.hide()


//엔진룸 안


//나가는 화살표
enginroom.arrow = new Object(enginroom,"arrow", "돌아가기.png")
enginroom.arrow.resize(120)
enginroom.arrow.locate(950, 650)
enginroom.arrow.onClick = function()
{Game.move(lastroom)}

//금고
enginroom.goldbox = new Box(enginroom,"goldbox", "safe2-se-close.png","safe2-se-open.png")
enginroom.goldbox.resize(120)
enginroom.goldbox.locate(250, 600)
enginroom.goldbox.lock()
enginroom.goldbox.onClick = function()
{if(lastroom.keys.isHanded()&&this.id.isLocked())
	{printMessage("키가 맞지 않다.")
}
else if(enginroom.shotgun.isHanded()&&this.id.isLocked()){
	playSound("shotgun.wav")
	printMessage("금고가 열렸다!")
	this.id.unlock()
}

else if(this.id.isOpened()){
	this.id.close()
	enginroom.kro.hide()
	enginroom.script.hide()

} 
else if (this.id.isClosed()){
	this.id.open()
	enginroom.kro.show()
	enginroom.script.show()

}

else{printMessage("너무 단단해서 열쇠로 열 수 없을 것 같다.")}
}


//설명서
enginroom.script = new Object(enginroom,"script", "설명서.png")
enginroom.script.resize(60)
enginroom.script.locate(250, 592)
enginroom.script.hide()
enginroom.script.onClick = function()
{showImageViewer("설명서.png", "")
printMessage("무언가를 제조할 수 있는 설명서다.")
}

//크로놀
enginroom.kro = new Object(enginroom,"kro", "크로놀.png")
enginroom.kro.resize(50)
enginroom.kro.locate(250, 637)
enginroom.kro.hide()
enginroom.kro.onClick = function()
{enginroom.kro.pick()
	printMessage("크로놀을 얻었다!")
lastroom.arrow.show()
frontroom.goa.show()
}

//크로놀폭탄
enginroom.krobomb = new Object(enginroom,"krobomb", "크로놀폭탄.png")
enginroom.krobomb.hide()

//크로놀폭탄
enginroom.shotgun = new Object(enginroom,"shotgun", "장전된총.png")
enginroom.shotgun.hide()

//총결합
Game.combination(frontroom.gun, lastroom.bullet, enginroom.shotgun)


//크로놀과 결합용기
Game.combination(frontroom.com_san_press, enginroom.kro, enginroom.krobomb)





Game.start(unclearroom, '너무 오래 달려왔더니 정신이 어지러워..')

Game.setGameoverMessage()