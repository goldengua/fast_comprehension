PennController.ResetPrefix(null) // Shorten command names (keep this line here))
Header(
// void
)
.log( "PROLIFIC_ID" , GetURLParameter("id") )
// Start with welcome screen, then present test trials in a random order,
// and show the final screen after sending the results
Sequence( "consent", "welcome", "practice_intro","practice", "experiment_intro", randomize("experiment"), "send" ,"exit", "final" )

//Sequence( "welcome" , "practice" , randomize("test") , "send" ,"exit", "final" )

Header( /* void */ )
    // This .log command will apply to all trials
    .log( "ID" , GetURLParameter("id") ) // Append the "ID" URL parameter to each result line

 newTrial("consent",
    newHtml("consent.html").print()
    ,
    newButton("I consent").print().wait()
     )
     

newTrial("intro",
    newHtml("intro", "intro.html")
        .print()
        .log()
    ,
    newButton("continue", "Click to continue")
        .center()
        .print()
        .wait(getHtml("intro").test.complete()
.failure(getHtml("intro").warn())
        )
)

// Welcome screen and logging user's ID
newTrial( "welcome" ,
    // We will print all Text elements, horizontally centered
    defaultText.css("font-size", "0.8em").center().print()
    ,
    newText("Welcome!")
    ,
    newText("In this experiment you will evaluate sentences.")
    ,
    newText("Some sentences might be produced wrongly.")
    ,
    newText("You are asked to decide whether the sentence is consistent with a speaker's intended meaning.")
    ,
    newText("The evaluation should focus on two aspects:")
    ,
    newText("(i) whether the sentence contains a spelling mistake:")
    ,
    newText("e.g. (John like apples) misses a letter (s) on the verb.")
    ,
    newText("(ii) whether the sentence describes a strange scenario:")
    ,
    newText("e.g. (Apples like John) is unlikely in real world.")
    ,
    newText("Press F if the sentence sounds right, or J if it is wrong.")
    ,
    newText("The sentence will be present one word at a time.")
    ,
    newText("You should do this as quickly and accurately as possible.")
    ,
    newText("When you are ready, press SPACE to do a practice run.")
    ,
    newKey(" ").wait()  // Finish trial upon press on spacebar
)



Template( "practice.csv" , 
    row => newTrial( "practice" ,   
        // Display all Text elements centered on the page, and log their display time code
        newText("practice").color("blue").print("center at 50vw","top at 1em")
        ,
        defaultText.center().print("center at 50vw","middle at 50vh").log()
        ,
        // Automatically start and wait for Timer elements when created, and log those events
        defaultTimer.log().start().wait()
        ,
        // Mask, shown on screen for 500ms
        newText("mask","######"),
        newTimer("maskTimer", 500),                       
        getText("mask").remove()
        ,
        // Prime, shown on screen for 42ms
        newController("DashedSentence", {s: row.sentence, mode: "speeded acceptability", 
            display: "in place", wordTime: 190+390, wordPauseTime: 390})
        .print("center at 50vw","middle at 50vh")
        .cssContainer({"font-size": "300%",        })
        .log()
        .wait()
        .remove()
        ,
        // Target, shown on screen until F or J is pressed
        newText("target","Do you think this is what the speaker meant?")
        ,
        // Use a tooltip to give instructions
        newTooltip("guide", "Now press F if this sounds right, J otherwise")
            .position("bottom center")  // Display it below the element it attaches to
            .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
            .print(getText("target"))   // Attach to the "target" Text element
        ,
        newKey("answerTarget", "FJ")
            .wait()                 // Only proceed after a keypress on F or J
            .test.pressed(row.expected)      // Set the "guide" Tooltip element's feedback text accordingly
            .success( getTooltip("guide").text("<p>Congratulations! Your answer is correct.</p>") )
            .failure( getTooltip("guide").text("<p>Oops, your answer is wrong.</p>") )
        ,
        getText("target")
            .text(row.sentence,'<p> </p>')
        ,
        getTooltip("guide")
            .label("Press SPACE to the next trial")  // Add a label to the bottom-right corner
            .key(" ")                       // Pressing Space will close the tooltip
            .wait()                         // Proceed only when the tooltip is closed
        ,
        getText("target").remove()          // End of trial, remove "target"
    )
    .log( "Type" , row.type)  // Append condition (tr. v op. v fi.) to each result line
    .log( "Expected"  , row.expected )  // Append expectped (f vs j) to each result line
    .log( "Plausibility", row.plausibility ) // Append prime type (rel. vs unr.) to each result line
    .log( "Item", row.item)
    .log( "Sentence", row.sentence)
)


newTrial( "experiment_intro" ,
    defaultText.center().print()
    ,
    newText("<p>Now let us start with the real experiment. </p>")
    ,
    newText("<p>When you are ready, press SPACE to begin the real experiment. </p>")
    ,
    newKey(" ").wait() 
)
// Executing experiment from list.csv table, where participants are divided into two groups (A vs B)
Template( "latinlist.csv" , 
    row => newTrial( "experiment" ,   
        // Display all Text elements centered on the page, and log their display time code
        defaultText.center().print("center at 50vw","middle at 50vh").log()
        ,
        // Automatically start and wait for Timer elements when created, and log those events
        defaultTimer.log().start().wait()
        ,
        // Mask, shown on screen for 500ms
        newText("mask","######"),
        newTimer("maskTimer", 500),                       
        getText("mask").remove()
        ,
        // Prime, shown on screen for 42ms
        newController("DashedSentence", {s: row.sentence, mode: "speeded acceptability", speed: row.speed,
            display: "in place", wordTime: 190+390, wordPauseTime: 390})
        .print("center at 50vw","middle at 50vh")
        .cssContainer({"font-size": "300%",        })
        .log()
        .wait()
        .remove()
        ,
        // Target, shown on screen until F or J is pressed
        newText("target","Do you think this is what the speaker meant?")
        ,
        // Use a tooltip to give instructions
        newTooltip("guide", "Now press F if this sounds right, J otherwise")
            .position("bottom center")  // Display it below the element it attaches to
            .key("", "no click")        // Prevent from closing the tooltip (no key, no click)
            .print(getText("target"))   // Attach to the "target" Text element
        ,
        newKey("answerTarget", "FJ")
            .wait()                 // Only proceed after a keypress on F or J
            .test.pressed(row.expected)      // Set the "guide" Tooltip element's feedback text accordingly
            .success( getTooltip("guide").text("<p>Congratulations! Your answer is correct.</p>") )
            .failure( getTooltip("guide").text("<p>Oops, your answer is wrong.</p>") )
        ,
        getTooltip("guide")
            .label("Press SPACE to the next trial")  // Add a label to the bottom-right corner
            .key(" ")                       // Pressing Space will close the tooltip
            .wait()                         // Proceed only when the tooltip is closed
        ,
        getText("target").remove()          // End of trial, remove "target"
    )
    .log( "Group"     , row.group)      // Append group (A vs B) to each result line
    .log( "Type" , row.type)  // Append condition (tr. v op. v fi.) to each result line
    .log( "Expected"  , row.expected )  // Append expectped (f vs j) to each result line
    .log( "Plausibility", row.plausibility ) // Append prime type (rel. vs unr.) to each result line
    .log( "Item", row.item)
    .log( "Sentence", row.sentence)
    .log("Speed", row.speed)
)

// newTrial("exit",
//     newHtml("exit", "exit.html")
//         .print()
//         .log()
//     ,
//     newButton("continue", "Click to continue")
//         .center()
//         .print()
//         .wait(getHtml("exit").test.complete()
                  
//     .failure(getHtml("exit").warn())
//         )
// )

newTrial( "exit" ,
       newText("<p>Thank you for your participation!</p>")
           .center()
           .print()
       ,
      // This is where you should put the link from the last step.
       newText("<p><a href='https://app.prolific.co/submissions/complete?cc=CODE'>Click here to validate your submission</a></p>")
           .center()
           .print()
       ,
       newButton("void")
           .wait()
   )
// Send the results
SendResults("send")

// A simple final screen
newTrial ( "final" ,
    newText("The experiment is over. Thank you for participating!")
        .print()
    ,
    newText("You can now close this page.")
        .print()
    ,
    // Stay on this page forever
    newButton().wait()
)
