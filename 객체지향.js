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

///////////////////////////////////
////////////////////////////////
//////////////////////////////////


unclearroom = new Room('unclearroom', '흔들리는배경.png')
frontroom = new Room('frontroom', '윌포드전방.jpg')
lastroom = new Room('lastroom', '배경112.png')	
room3 = new Room('room3', '배경-3.png')		

//흔들리는 배경
unclearroom.box = new Object(unclearroom, "box", "상자3-닫힘.png")
unclearroom.box.resize(130) 
unclearroom.box.locate(880, 590)
unclearroom.box.onClick = function() {
	printMessage("상자 속에 무언가가 있다!")
	unclearroom.pill.show()
	unclearroom.box.setSprite('상자3-열림.png')
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
frontroom.key1 = new Item(frontroom, 'key1', '비서_아이디카드.png')
frontroom.key1.resize(75)
frontroom.key1.locate(700, 650)
frontroom.key1.hide()




//총
frontroom.gun = new Object(frontroom, 'gun', '권총.png')
frontroom.gun.resize(55)
frontroom.gun.locate(769, 650)
frontroom.gun.hide()
frontroom.gun.onClick = function(){
	frontroom.gun.pick()
	printMessage("총알이 없는 총을 주웠다.");
}





//선반
frontroom.shelter = new Object(frontroom, 'shelter', '선반열차.png')
frontroom.shelter.resize(205)
frontroom.shelter.locate(175, 500)


//방망이
frontroom.bat = new Item(frontroom, 'bat', '방망이.png')
frontroom.bat.resize(155)
frontroom.bat.locate(175, 500)

//방패
frontroom.armour = new Item(frontroom, 'armour', '방패.png')
frontroom.armour.resize(165)
frontroom.armour.locate(175, 400)


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



//상자
frontroom.box = new Object(frontroom, "box", "상자3-닫힘.png")
frontroom.box.resize(130) 
frontroom.box.locate(880, 590)
frontroom.box.onClick = function() {
	frontroom.box.setSprite('상자3-열림.png')
	printMessage("상자 안엔 아무것도 없다.")
}

//윌포드문양
frontroom.mark = new Object(frontroom, "mark", "윌포드문양.png")
frontroom.mark.resize(50) 
frontroom.mark.locate(712, 290)
frontroom.mark.onClick = function() {

		printMessage("승인된 카드 없이는 들어갈 수 없다.")
}


//문
frontroom.door1 = new Door(frontroom, 'door1', '윌포드전방-문닫힘.png', '윌포드전방-문열림.png', lastroom)
frontroom.door1.resize(173)
frontroom.door1.locate(580, 300)

frontroom.door1.onClick = function(){

	if (frontroom.key1.isHanded() && !this.id.isLocked() && this.id.isClosed()){
		this.id.open()
		printMessage("문이 열린다.")
	}


	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
	}

	else if(this.id.isClosed())
		{printMessage("문이 닫혀있다")
	}

	else {Game.end()
		}
	}






//마지막 방

//윌포드
lastroom.ford = new Object(lastroom, "ford", "윌포드휠체어.png") // 
lastroom.ford.resize(230) // 크기 조절
lastroom.ford.locate(980, 490) // 

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

		printMessage("카터스 : (머뭇 머뭇)")
		buttonClick += 1
	}

	else if(buttonClick == 8){
		playSound("윌포드_컴언.wav")

		printMessage("윌포드 : \"어서\"")
		buttonClick += 1
	}
	else if(buttonClick == 9){
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
		printMessage("고아성 : \"카티스 정신차려요!\"")
		lastroom.ford.setSprite('윌포드_죽음.png')
		lastroom.littlegirl.show()

}
}


//고아성
lastroom.littlegirl = new Object(lastroom,"littlegirl", "고아성.png")
lastroom.littlegirl.resize(150)
lastroom.littlegirl.locate(250, 630)
lastroom.littlegirl.hide()




//돌아가기
lastroom.arrow = new Object(lastroom,"arrow", "돌아가기.png")
lastroom.arrow.resize(120)
lastroom.arrow.locate(250, 600)
lastroom.arrow.hide()
lastroom.arrow.onClick = function()
{Game.move(frontroom)}


//엔진
lastroom.engine = new Object(lastroom,"engine", "엔진.png")
lastroom.engine.resize(250)
lastroom.engine.locate(640, 390)
lastroom.engine.onClick = function()
{
printMessage("멈추지 않는 엔진이다.")
}


lastroom.door2 = new Door(lastroom, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room3)
lastroom.door2.resize(120)
lastroom.door2.locate(1000, 305)
lastroom.door2.hide()

lastroom.keypad1 = new Keypad(lastroom, 'keypad1', '키패드-우.png', '1234', function(){
	printMessage('스르륵 문이 보인다')
	lastroom.door2.show()
})
lastroom.keypad1.resize(20)
lastroom.keypad1.locate(920, 250)

// onClick 함수를 재정의할 수도 있다
lastroom.keypad1.onClick = function(){
	printMessage('1234')
	showKeypad('number', this.password, this.callback)
}

room3.door1 = new Door(room3, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', lastroom)
room3.door1.resize(120)
room3.door1.locate(300, 297)

room3.door2 = new Door(room3, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png')
room3.door2.resize(120)
room3.door2.locate(1000, 313)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '키패드-우.png', '1234', room3.door2, '철커덕')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)

Game.start(unclearroom, '크로롤 때문에 정신이 어지러워..')

Game.setGameoverMessage()