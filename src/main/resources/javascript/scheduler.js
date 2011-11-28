AJS.$(function () {
    // Function for getting the issue key of the issu ebeing edited.
    var getIssueKey = function(){
        if (JIRA.IssueNavigator.isNavigator()){
            return JIRA.IssueNavigator.getSelectedIssueKey();
        } else {
            return AJS.$.trim(AJS.$("#key-val").text());
        }
    };

    // Function for getting the project key of the Issue being edited.
    var getProjectKey = function(){
        var issueKey = getIssueKey();
        if (issueKey){
            return issueKey.match("[A-Z]*")[0];
        }
    };

    JIRA.Dialogs.scheduleIssue = new JIRA.FormDialog({
        id: "schedule-dialog",
        trigger: "a.issueaction-schedule-issue", 
        ajaxOptions: JIRA.Dialogs.getDefaultAjaxOptions,
        onSuccessfulSubmit : function(){  // This method is used to define behaviour on a successful form submission.
            // We want to get the versions specified then place them in the view.
            // This selector will get the container for the FixFor Version for both a list of issues and the view issue page.
            var $fixForContainer = AJS.$("#issuerow" + JIRA.IssueNavigator.getSelectedIssueId() + " td.fixVersions, #fixfor-val" );
            $fixForContainer.html("");  // Blank out the existing versions
            // Now lets construct the html to place into the container
            var htmlToInsert = "";
            // this.getContentArea() return the contents of the dialog.  From this we will get teh selected values of the select list and iterate over them.
            this.getContentArea().find("#fixVersions option:selected").each(function(){
                var $option = AJS.$(this);
                // We want to comma separate them
                if (htmlToInsert !== ""){
                    htmlToInsert += ", ";
                }
                var versionName = AJS.$.trim($option.text());
                // Construct the link and append it to the html
                htmlToInsert += "<a href='" + contextPath + "/browse/" + getProjectKey() + "/fixforversion/" + $option.val()+ "' title='" + versionName + "'>" + versionName + "</a>";
            });

            // If no options were selected, insert none.
            if (htmlToInsert === ""){
                htmlToInsert = AJS.I18n.getText("common.words.none");
            }
            // set the html of the container.
            $fixForContainer.html(htmlToInsert);
        },
        onDialogFinished : function(){  // This function is used to define behaviour after the form has finished
            // We want to display a notification telling people that the fix version has been updated.
            // If it is displaying in the Issue Navigator we want to also show the issue key of the issue updated.
            if (JIRA.IssueNavigator.isNavigator()){
                JIRA.Messages.showSuccessMsg(AJS.I18n.getText("scheduler.success.issue", getIssueKey()));
            } else {
                JIRA.Messages.showSuccessMsg(AJS.I18n.getText("scheduler.success"));
            }
        },
        autoClose : true // This tells the dialog to automatically close after a successful form submit.

    });
});