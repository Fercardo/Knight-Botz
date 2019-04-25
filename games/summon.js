'use strict';

function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

const name = "Summon";
const data = {};
const monForms = {};

for (let i in Tools.data.pokedex) {
	let mon = Tools.data.pokedex[i];
	if (!mon.species) continue;
	let species = mon.species;
	data[species] = {};
	data[species]["Pokemon Types"] = mon.types;
	data[species]["Egg Groups"] = mon.eggGroups;
	data[species]["Color"] = [mon.color];
	if (mon.otherFormes) {
		for (let i = 0, len = mon.otherFormes.length; i < len; i++) {
			monForms[mon.otherFormes[i]] = species;
		}
	}
	if (i in Tools.data.learnsets) {
		data[species]["Pokemon Moves"] = [];
		for (let move in Tools.data.learnsets[i].learnset) {
			data[species]["Pokemon Moves"].push(Tools.data.moves[move].name);
		}
	} else {
		if (i in monForms) {
			data[species]["Pokemon Moves"] = data[monForms[i]]["Pokemon Moves"];
		}
	}
}

class Summon extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.id = Tools.toId(name);
		this.categories = Object.keys(data["Bulbasaur"]);
		this.mons = new Map();
    this.points = new Map();
		this.maxPoints = 3;
    this.guessed = 0;
    this.round = 1;
	}

	onStart() {
		//if (this.playerCount < 2) {
			//this.room.say("The game needs at least 2 players to play!");
			//this.end();
			//return;
		//}
		this.askForMons();
	}

	nextRound() {
    this.guessed = 0;
    this.mons.clear();
    this.askForMons();
	}

	randPoke(user) {
		let keys = Object.keys(data);
				var randpoke = shuffle(keys)[0];
				this.say("/wall Randomly chose pokemon : **" + randpoke + "**");
    this.say("!dt " + randpoke);
    this.matchMons(randpoke);
    //this.suspect();
   
  }

  
  matchMons(randpoke){
    
     var i = 0;
		for(i = 0; i < this.playerCount;i++){
      let player = this.room.game.getPlayerNames().split(',')[i];
      if(player.indexOf(" ") === 0) player = this.room.game.getPlayerNames().split(',')[i].slice[0];
        this.say("/wall For " + player);
      
      let pokemon = this.mons[player];
      this.say("!dt " + pokemon);
      let pname, tier, type1, type2, bst, atk, def, spd, spa, hp, spe, gen, nulll; 
      let rname, rtier, rtype1, rtype2, rbst, ratk, rdef, rspa, rspd, rspe, rgen;
      //choosen pokemon stats
      pname = Tools.getPokemon(pokemon).name;
      tier = Tools.getPokemon(pokemon).tier;
      type1 = Tools.getPokemon(pokemon).types[0];
      type2 = Tools.getPokemon(pokemon).types[1];
      nulll = Tools.getPokemon('pikachu').types[1];
      if(type2 == nulll) type2 = "fuck";
      atk = parseInt(Tools.getPokemon(pokemon).baseStats.atk);
      def = parseInt(Tools.getPokemon(pokemon).baseStats.def);
      spd = parseInt(Tools.getPokemon(pokemon).baseStats.spd);
      spa = parseInt(Tools.getPokemon(pokemon).baseStats.spa);
      spe = parseInt(Tools.getPokemon(pokemon).baseStats.spe);
      bst = atk + def + spa + spd + spe;
      gen = Tools.getPokemon(pokemon).gen;

      
      //random pokemon stats
      rname = Tools.getPokemon(randpoke).name;
      rtier = Tools.getPokemon(randpoke).tier;
      rtype1 = Tools.getPokemon(randpoke).types[0];
      rtype2 = Tools.getPokemon(randpoke).types[1];
      ratk = parseInt(Tools.getPokemon(randpoke).baseStats.atk);
      rdef = parseInt(Tools.getPokemon(randpoke).baseStats.def);
      rspd = parseInt(Tools.getPokemon(randpoke).baseStats.spd);
      rspa = parseInt(Tools.getPokemon(randpoke).baseStats.spa);
      rspe = parseInt(Tools.getPokemon(randpoke).baseStats.spe);
      rbst = ratk + rdef + rspa + rspd + rspe;
      rgen = Tools.getPokemon(randpoke).gen;
      
      //matching stats
      var m = 0;
      if(pname == rname) { this.say("**Pokemon matched for " + player + "!**"); this.room.game.givepts(player, 5); m++; }
      if(tier == rtier) { this.say("**Tier matched for " + player + "!**"); this.room.game.givepts(player, 2); m++; }
      if(type1 == rtype1) { this.say("**Type matched for " + player + "!**"); this.room.game.givepts(player, 1); m++; }
      if(type2 == rtype2) { this.say("**Type matched for " + player + "!**"); this.room.game.givepts(player, 1); m++; }
      if(bst == rbst) { this.say("**BST matched for " + player + "!**"); this.room.game.givepts(player, 4); m++; }
      if(gen == rgen) { this.say("**Gen matched for " + player + "!**"); this.room.game.givepts(player, 2); m++; }
     /* for(let i = 0; i < 4; i++) {
        var evos = Tools.getPokemon(randpoke).evos.split(',')[i];
      if(Tools.getPokemon(pokemon).name == evos) { this.say("**Evolutionary line matched for " + player + "!**"); m++; }
      }*/
       else {
         this.say("nothng matched"); 
       }
      }
    this.round++;
      if(this.round < 6) this.nextRound();
  }
  
  
	askForMons() {
		for (let id in this.players) {
			Users.get(id).say("Please tell me what is your guess (Usage: ``" + Config.commandCharacter + "choose <mon>``)");
		}
     this.say("/wall Round " + this.round + " guess a pokemon and pm me");
		//this.timeout = setTimeout(() => this.chooseKillers(), 30 * 1000);
    
	}

  
  	givepoint(user, points) {
		this.pts[user.name] = this.pts[user.name] + points;
	}
  
  
  
  

	choose(user, target) {
		if (!(user.id in this.players)) {
			return;
    }
		target = Tools.toId(target);
		let species;
		if (Tools.data.pokedex[target]) species = Tools.data.pokedex[target].species;
		if (!species || !(species in data)) {
			user.say("That is not a valid Pokémon!");
			return;
		}
		for (let id in this.mons) {
			if (this.mons[id] === species) {
				user.say("That Pokémon has already been chosen! Please choose another");
				return;
			}
		}
		user.say("You have chosen " + species + "!");
		this.mons[user.id] = species;
    this.guessed++;
    if(this.playerCount === this.guessed) this.randPoke(user);
    
	}
}

exports.name = name;
exports.id = "summon";
exports.description = "Each player has to guess a pokemon any pokemons. The bot will choose a random pokemon and players get points by the similar 'Pokemon things that the randpoke was'";//"Magnezone's Murder Mystery! Every person chooses a pokemon, after which the bot says which players are killers and which players are regular people. Your goal is to figure out who is which mon based on the params listed. However, for killers the param will always be the opposite of what is stated! Last group surviving (either regular people or killers) wins.";
exports.game = Summon;