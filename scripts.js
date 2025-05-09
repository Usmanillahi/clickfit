function fetchFact() {
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        success: function(data) {
            $('#fact').text(data.text);
        }
    });
}

// fetch on page load
fetchFact();

// fetch api everry 2 secs
setInterval(fetchFact, 2000);

    // Register user
    $('#registerForm').on('submit', function(e) {
      e.preventDefault();
      const email = $('#email').val();
      const password = $('#password').val();
      const type = $('#type').val();

      $.post('/register', { email, password, type }, function(response) {
        $('#registerMessage').text(response);
        loadUsers();
      });
    });

    // Load users
    function loadUsers() {
      $.get('/users', function(users) {
        $('#userList').empty();
        users.forEach(user => {
          $('#userList').append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="text-dark">${user.email} - ${user.type}</span>
                <button class="delete-btn btn btn-danger btn-sm" data-id="${user.ID}">Delete</button>
            </li>
          `);
        });

        // Attach click event to delete buttons
        $('.delete-btn').on('click', function() {
          const userId = $(this).data('id');
          deleteUser(userId);
        });
      });
    }

    // Function to delete a user and refresh user database
    function deleteUser(userId) {
      $.ajax({
        url: `/users/${userId}`,
        type: 'DELETE',
        success: function(response) {
          alert(response);
          loadUsers();
        },
        error: function(err) {
          alert("Error deleting user: " + err.responseText);
        }
      });
    }

    // Initial load of users
    loadUsers();

    // Drag and drop handling
    let dropArea = document.getElementById('drop-area');

    dropArea.addEventListener('dragover', e => {
      e.preventDefault();
      dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', e => {
      e.preventDefault();
      dropArea.classList.remove('dragover');
      handleFiles(e.dataTransfer.files);
    });

    dropArea.addEventListener('click', () => {
      document.getElementById('fileElem').click();
    });

    document.getElementById('fileElem').addEventListener('change', function () {
      handleFiles(this.files);
    });

    function handleFiles(files) {
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }

      fetch("/upload", {
        method: "POST",
        body: formData
      }).then(response => {
        if (response.ok) alert("Upload successful!");
        else alert("Upload failed.");
      });
    }
// show hide for regestered users implemented here
$(document).ready(function() {
    $('#toggleUserList').click(function() {
        if ($('#userSection').hasClass('show')) {
            $(this).text('Show registered users'); 
        } else {
            $(this).text('Hide registered users'); 
        }
    });
});
$(document).ready(function() {
  $('.faq-heading').on('click', function() {
      var target = $(this).data('target');
      $('.collapse').not(target).collapse('hide');
  });
});
// hamberger for topnav implemented here
document.getElementById('hamburger').addEventListener('click', function() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('show');
});