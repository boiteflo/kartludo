class ServiceFight {
    
  static creatures = [];

  static handleAllCommand(message, creaturesOverride){
    this.creatures = creaturesOverride ? creaturesOverride : this.creatures;  
    
    const msg = message.trim().toLowerCase();      
      const result = [];
      msg.split(',').forEach(x=> 
        this.handleCommand(result, x.trim()));
    
      return result.join('\n');
    }
    
    static handleCommand(result, command){
      const instructions = command.split(' ');  
      const name = instructions.shift();
      let creature = this.getCreature(instructions);
      if(!creature){
        result.push( name + " doesn't exist.");
      }
      
      if(command.startsWith('set'))
        this.handleSet(result, creature, instructions);
      
      if(command.startsWith('show'))
        this.handleShow(result, creature, instructions);
      
      if(command.startsWith('attack'))
          this.handleAttack(result, creature, instructions, true);
      
      if(command.startsWith('spell'))
          this.handleAttack(result, creature, instructions, false);
      
      if(command.startsWith('add'))
          this.handleAdd(result, creature, instructions);
    
      if(result.length < 1)
        result.push("No valid command.");
    }
    
    static getCreature(instructions){
      const name = instructions.shift();
      let creature = this.creatures.find(x=> x.name== name);
      if(creature) return creature;
    
      creature = {name};
      this.creatures.push(creature);
      return creature;
    }
    
    // set aziel pv 20 shield 32 ref 8 vig 8 vol 12
    static handleSet(result, creature, instructions){
      let i = 0;
      while(instructions[i]){
        const val = instructions[i+1];
        const number = parseInt(val);
        creature[instructions[i]] = isNaN(val) ? val : number;
        i+=2;
      }
    
      result.push(creature.name + ' have been updated');
    }
    
    // show aziel pv shield
    static handleShow(result, creature, instructions){
      let i = 0;
      let messages = [];
      while(instructions[i]){
        const val = creature[instructions[i]];
        if(val)
          messages.push(instructions[i] + ":" + val);
        i++;
      }
      result.push(creature.name + " " + messages.join(' '));
    }
    
    // add snukbi pv 10 shield -2
    static handleAdd(result, creature, instructions){
      let i = 0;
      let messages = [];
      while(instructions[i]){
        const attributeProperty = instructions[i];
        let attributeValue = creature[attributeProperty];
        if(isNaN(attributeValue))
          messages.push(attributeProperty + " x");
        else{
          let rollInstruction = attributeValue + "+" + instructions[i+1];
          rollInstruction = rollInstruction.replaceMany("+-", "-");
          const updateValue = this.handleRoll(rollInstruction);
          messages.push(attributeProperty + " " + updateValue.expression);
          creature[attributeProperty] = updateValue.value;
        }
        i+=2;
      }
      result.push(creature.name + " " + messages.join(' '));
    }
    
    // attack snukbi 1d20+5 ca 1d8+3 pv Attaque de javelot
    // spell aziel 18 ref 3d4 pv Arc électrique
    static handleAttack(result, creature, instructions, isNormalAttack){
      const rollAtk = instructions.shift();
      const targetProperty = instructions.shift();
      const rollDam = instructions.shift();
      const pvProperty = instructions.shift();
      const label = instructions.join(' ');
    
      const targetValue = this.handleRoll(creature[targetProperty]);
      const atk = this.handleRoll(rollAtk);
    
      if(!targetValue || isNaN(targetValue.value)){
        result.push("-- " + label + " versus "+ creature.name + " -- Attack:" + atk.expression + " vs " + targetProperty + ": ???");
        return;
      }
    
      let message = "-- " + label + " versus "+ creature.name + " -- Attack:" + atk.expression + " vs " + targetProperty + ":" + targetValue.expression;
      
      if(isNormalAttack) 
        message += this.ApplyDamageNormal(creature, atk, targetValue, rollDam, pvProperty);
      else 
        message += this.ApplyDamageBasic(creature, atk, targetValue, rollDam, pvProperty);
    
      result.push(message);
    }
    
    static ApplyDamageNormal(creature, atk, targetValue, rollDam, pvProperty){
      if(atk.dice==1 || atk.value +10 <= targetValue.value)
        return " ### The attack critically fails ###";  
        
      if(atk.value < targetValue.value)
        return " ### The attack fails ###";  
    
      if(atk.dice >= 20 || atk.value - 10 >= targetValue.value){
        rollDam+="*2";
        return " ### the attack critically succeeded" + this.ApplyDamage(creature, rollDam, pvProperty) + " ###";
      }
      
      return " ### the attack succeeded" + this.ApplyDamage(creature, rollDam, pvProperty) + " ###";
    }
    
    static ApplyDamageBasic(creature, atk, targetValue, rollDam, pvProperty){
      if(targetValue.dice == 20 || targetValue.value - 10 >= atk.value)
        return " ### The attack critically fails ###";
    
      if(targetValue.value >= atk.value){
        rollDam+="/2";
        return " ### The attack partially fails. " + this.ApplyDamage(creature, rollDam, pvProperty) + " ###";
      }
    
      if(targetValue.dice > 1 && targetValue.value + 10 > atk.value)
        return " ### the attack succeeded" + this.ApplyDamage(creature, rollDam, pvProperty) + " ###";
    
      else {
        rollDam+="*2";
        return " ### the attack critically succeeded " + this.ApplyDamage(creature, rollDam, pvProperty) + " ###";
      }  
    }
    
    static ApplyDamage(creature, rollDam, pvProperty){
      const dam = this.handleRoll(rollDam);
      let pvValue = this.handleRoll(creature[pvProperty]);
      
      let message = " Damages:" + dam.expression + " " + creature.name + " " + pvProperty + ":" + pvValue.value + "-" + dam.value + "=";
      pvValue.value-= dam.value;
      creature[pvProperty]=pvValue.value;
      message+= creature[pvProperty];
      return message;
    }
    
    static handleRoll(command){
      if(!command) return;
      const cmd = command.toString()
        .replaceMany("+"," + ")
        .replaceMany("-"," - ")
        .replaceMany("*"," * ")
        .replaceMany("/"," / ");
      const isRoll = this.isIncludingOperator(cmd);
      if(!isRoll)
        return this.rollDice(cmd);
      
      let values = cmd.split(' ');
      let result =this.rollDice(values.shift());
        
      while(values[0] && values[1]){
        const operator = values.shift();
        
        let val2 = values.shift();
        val2 = val2.includes("d") ? this.rollDice(val2) : {expression:val2, value:parseInt(val2)};
    
        result.expression += operator + val2.expression;
        if(operator == "+") result.value += val2.value;
        if(operator == "-") result.value -= val2.value;
        if(operator == "*") result.value *= val2.value;
        if(operator == "/") result.value /= val2.value;
      }
      
      result.expression += "=" + result.value;
      return result;
    }
    
    static isIncludingOperator(command){
      return command.includes("+") || command.includes("-") || command.includes("*") || command.includes("/");
    }
    
    static rollDice(command) {
      if(!command.includes("d"))
        return {dice:10, expression:command, value:parseInt(command)};
        
      let values = command.split("d");
      const number=values.shift();
      const faces=values.shift();
      let results = [];
      for(let i=0; i < number; i++)
        results.push(Math.floor(Math.random() * faces) + 1);
    
      const result = results.reduce((a,x)=> a+x,0);
      const text = results.length < 2 ? result : results.join("+") + "=" + result;
      return {dice:result, expression: command + "(" + text + ")", value:result};
    }
}

module.exports = ServiceFight;