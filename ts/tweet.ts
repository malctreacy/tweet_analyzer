class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith('Watch my ')){
            return 'live_event';
        }
        else if (this.text.startsWith('Achieved ')){
            return 'achievement';
        }
        else if (this.text.startsWith('Just posted ') || this.text.startsWith('Just completed ')){
            return 'completed_event';
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        
        let roboRemovalHarness: string[] = ['with @Runkeeper. Check it out!','#RKLive','#Runkeeper','#FitnessAlerts', 'Distance...', 'Duration...',' - HIIT', 'with :'];
        
        function removeRoboText(tweetText: string, roboRemovalHarness: string[]){
            let urlReg: RegExp = /(https?:\/\/[^\s]+)/g;
            let completedReg: RegExp = /((Just completed a )(([0-9]*\.[0-9]*)([ ])(mi|km))*([ ])*((run)|(walk)|(activity)|(mtm bike)|(hike)|(MySports Freestyle)|(row)|(swim)|(bike)|(elliptical workout)))/;
            let postedReg: RegExp = /((Just posted a )(([0-9]*\.[0-9]*)([ ])(mi|km))*([ ])*((elliptical workout)|(MySports Gym)|(meditation)|(run)|(MySports Freestyle)|(bike)|(walk)|(strength workout)|(spinning workout)|(core workout)|(swim)|(yoga practice)|(CrossFit\\u00ae workout)|(pilates session)|(bootcamp workout)|(row)|(group workout))(( in )([0-9]*[:[0-9]*))*)/;
            let watchMeReg: RegExp = /(Watch my )(([0-9]*\.[0-9]*)([ ])(mi|km))*([ ])*((run)|(walk)|(bike)|(hike))( right now with @Runkeeper Live)/;
            let achieveReg: RegExp = /(Achieved a new personal record)/;
            let tt: RegExp = /(- TomTom MySports Watch)/;
            let randomDash = /(-)/;
            
            for (var i = 0; i < roboRemovalHarness.length; i++){
                tweetText = tweetText.replace(roboRemovalHarness[i], '');
            }
            
            tweetText = tweetText.replace(urlReg,'');
            tweetText = tweetText.replace(completedReg,'');
            tweetText = tweetText.replace(postedReg,'');
            tweetText = tweetText.replace(watchMeReg, '');
            tweetText = tweetText.replace(achieveReg, '');
            tweetText = tweetText.replace(tt,'');
            tweetText = tweetText.replace(randomDash,'');
            
            
            if(tweetText.length > 5){
                return true;
            }
            
            else{
                return false;
            }
        }

        return removeRoboText(this.text, roboRemovalHarness);
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        else{
            let roboRemovalHarness: string[] = ['with @Runkeeper. Check it out!','#RKLive','#Runkeeper','#FitnessAlerts', 'Distance...', 'Duration...',' - HIIT', 'with :'];
            
            function removeRoboText(tweetText: string, roboRemovalHarness: string[]){
                //let urlReg: RegExp = /(https?:\/\/[^\s]+)/g;
                let completedReg: RegExp = /((Just completed a )(([0-9]*\.[0-9]*)([ ])(mi|km))*([ ])*((run)|(walk)|(activity)|(mtm bike)|(hike)|(MySports Freestyle)|(row)|(swim)|(bike)|(elliptical workout)))/;
                let postedReg: RegExp = /((Just posted a )(([0-9]*\.[0-9]*)([ ])(mi|km))*([ ])*((elliptical workout)|(MySports Gym)|(meditation)|(run)|(MySports Freestyle)|(bike)|(walk)|(strength workout)|(spinning workout)|(core workout)|(swim)|(yoga practice)|(CrossFit\\u00ae workout)|(pilates session)|(bootcamp workout)|(row)|(group workout))(( in )([0-9]*[:[0-9]*))*)/;
                let watchMeReg: RegExp = /(Watch my )(([0-9]*\.[0-9]*)([ ])(mi|km))*([ ])*((run)|(walk)|(bike)|(hike))( right now with @Runkeeper Live)/;
                let achieveReg: RegExp = /(Achieved a new personal record)/;
                let tt: RegExp = /(- TomTom MySports Watch)/;
                let randomDash = /(-)/;
                
                for (var i = 0; i < roboRemovalHarness.length; i++){
                    tweetText = tweetText.replace(roboRemovalHarness[i], '');
                }
                
                //tweetText = tweetText.replace(urlReg,'');
                tweetText = tweetText.replace(completedReg,'');
                tweetText = tweetText.replace(postedReg,'');
                tweetText = tweetText.replace(watchMeReg, '');
                tweetText = tweetText.replace(achieveReg, '');
                tweetText = tweetText.replace(tt,'');
                tweetText = tweetText.replace(randomDash,'');
                
                
                return tweetText;
                
            }
    
            this.text = removeRoboText(this.text, roboRemovalHarness);
            
            return this.text;
        }
    }

    get activityType():string {
        if(this.text.search(/(hike)/i) != -1){
            return "Hiking";
        }
        if(this.text.search(/walk/i) != -1){
            return "Walking";
        }
        if(this.text.search(/(jog)/mg) != -1){
            return "Jogging";
        }
        if(this.text.search(/swim/i) != -1){
            return "Swimming";
        }
        if(this.text.search(/(bike)|(ride)/i) != -1){
            return "Biking";
        }
        if(this.text.search(/(class)|(yoga)/i) != -1){
            return "Group Workout";
        }
        if(this.text.search(/(Elliptical)|(CrossFit)/i) != -1){
            return "Gym Workout";
        }
        if(this.text.search(/(run)/mg) != -1){
            return "Running";
        }
        else{
            return "Something Else";
        }
    }

    get distance():number {

        let disRegExp: RegExp = /(([0-9]\.[0-9]*)([ ])(mi|km))+/;
        if(this.source != 'completed_event') {
            return 0;
        }
        let str:string = this.text;
        let splitted: string[] = str.split(" ");
        
        let totalDistance: number = parseFloat(splitted[3]);
        
        if (splitted[4] == 'km'){
            totalDistance = totalDistance * 0.621371;
        }
        
        return totalDistance;
        
        
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}