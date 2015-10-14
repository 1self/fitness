if (Meteor.isClient) {
    var config = {
        appId: "app-id-2ce584ae4feb02d056bf92c83c4a643e",
        appSecret: "app-secret-c798c1120a9e56ec047da064431c75da1619efb58c00f4ab0611e2f3c6fd62f8",
        "appName": "co.1self.fitness",
        "appVersion": "0.0.1"
    };

    var lib1self = new Lib1selfClient(config, "production");

    var stream;
    Meteor.startup(function() {
        lib1self.fetchStream(function(err, response) {
            stream = response;
        });
    });

    var logTo1Self = function($logButton, actionTags, quantity) {
        var oldText = $logButton.html();
        $logButton.prop('disabled', true);
        $logButton.html('Sending event');
        var eventToLog = {
            "source": config.appName,
            "version": config.appVersion,
            "objectTags": ["self"],
            "actionTags": actionTags,
            "properties": {
                "quantity": quantity
            }
        };

        lib1self.sendEvent(eventToLog, stream);
        console.log("Event sent:");
        console.log(eventToLog);
        setTimeout(function() {
            $logButton.html('Sent');
            setTimeout(function() {
                $logButton.html(oldText);
                $logButton.prop('disabled', false);
            }, 1000);

        }, 1000);
    };

    var viewViz = function(actionTags) {
        var url = lib1self
            .objectTags(["self"])
            .actionTags(actionTags)
            .sum("quantity")
            .barChart()
            .backgroundColor("ddcc19")
            .url(stream);
        console.info(url);
        $(".logActivityTemplate").hide();
        window.open(url, "_system", "location=no");
    };


    Template.logging.events({
        'click #logPressups': function() {
            var inputField = $("input[name='pressup']");
            logTo1Self($('#logPressups'), ["press-up"], parseInt(inputField.val()));
        },
        'click #logChinups': function() {
            var inputField = $("input[name='chinup']");
            logTo1Self($('#logChinups'), ["chin-up"], parseInt(inputField.val()));
        },
        'click #logBirddogs': function() {
            var inputField = $("input[name='birddog']");
            logTo1Self($('#logBirddogs'), ["bird-dog"], parseInt(inputField.val()));
        },
        'click #logStretching': function() {
            logTo1Self($('#logStretching'), ["stretch"], 1);
        }
    });

    Template.footer.events({
        'click #displayLogActivityTemplate': function() {
            $(".logActivityTemplate").show();
            $(".showVizTemplate").hide();
        },
        'click #displaySelectVizTemplate': function() {
            $(".showVizTemplate").show();
            $(".logActivityTemplate").hide();
        }
    });

    Template.selectVisualizations.events({
        'click #pressupViz': function() {
            viewViz(["press-up"]);
        },
        'click #chinupViz': function() {
            viewViz(["chin-up"]);
        },
        'click #birddogViz': function() {
            viewViz(["bird-dog"]);
        },
        'click #stretchingViz': function() {
            viewViz(["stretch"]);
        }
    });
}

if (Meteor.isServer) {

}
