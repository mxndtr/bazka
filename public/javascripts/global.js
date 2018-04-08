// Userlist data array for filling in info box
var PetListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the user table on initial ppetSpecies load
  populateTable();

  // Username link click
  $('#petList table tbody').on('click', 'td a.linkshowuser', showPetInfo);

  // Add User button click
  $('#btnAddPet').on('click', addPet);

  // Delete User link click
  $('#petList table tbody').on('click', 'td a.linkdeleteuser', deletePet);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/pets/petlist', function( data ) {

    // Stick our user data array into a userlist variable in the global object
    PetListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.petId + '" title="Show Details">' + this.petId + '</a></td>';
      tableContent += '<td>' + this.petName + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#petList table tbody').html(tableContent);
  });
};

// Show User Info
function showPetInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve petId from link rel attribute
  var thisPetName = $(this).attr('rel');

  // Get Index of object based on id value
  var arrayPosition = PetListData.map(function(arrayItem) { return arrayItem.petId; }).indexOf(thisPetName);

  // Get our User Object
  var thisPetObject = PetListData[arrayPosition];

  //Populate Info Box
  $('#petInfoKind').text(thisPetObject.petKind);
  $('#petInfoSpecies').text(thisPetObject.petSpecies);
  $('#petInfoBirthday').text(thisPetObject.petBirthday);
  $('#petInfoGender').text(thisPetObject.petGender);

};

// Add User
function addPet(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addPet input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all user info into one object
    var newPet = {
      'petId': $('#addPet fieldset input#inputPetId').val(),
      'petName': $('#addPet fieldset input#inputPetName').val(),
      'petKind': $('#addPet fieldset input#inputPetKind').val(),
      'petSpecies': $('#addPet fieldset input#inputPetSpecies').val(),
      'petGender': $('#addPet fieldset input#inputPetGender').val(),
      'petBirthday': $('#addPet fieldset input#inputPetBirthday').val()
    }
    
    // Use AJAX to post the object to our addPet service
    $.ajax({
      type: 'POST',
      data: newPet,
      url: '/pets/addPet',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addPet fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {

        // If something goes wrong, alert the error messpetSpecies that our service returned
        alert('Error: ' + response.msg);

      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Delete User
function deletePet(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check and make sure the user confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/pets/deletepet/' + $(this).attr('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};