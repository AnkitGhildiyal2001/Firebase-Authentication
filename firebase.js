const firebaseConfig = {
  apiKey: "AIzaSyAII5e8-hAnq-3DG3r4NWtyFBYWCYxJUL8",
  authDomain: "cardition1-e9d80.firebaseapp.com",
  projectId: "cardition1-e9d80",
  storageBucket: "cardition1-e9d80.appspot.com",
  messagingSenderId: "157187007966",
  appId: "1:157187007966:web:b54d7ad41a093819eae94f",
  measurementId: "G-PML7ZM7H4H"
};

let check =0 ;

firebase.initializeApp(firebaseConfig);
// const txtname=document.getElementById('txtname');
const txtemail = document.getElementById('txtemail');
const txtpassword = document.getElementById('txtpassword');

const emaillog = document.getElementById('emaillog');
const passlog = document.getElementById('passlog');

const btnlogin = document.getElementById('btnlogin');
const btnsignup = document.getElementById('btnsignup');
const btnlogout = document.getElementById('btnlogout');

// Initialize Firebase

btnlogin.addEventListener('click', e => {
  // console.log("hello");
  e.preventDefault();
  const email1 = emaillog.value;
  const pass1 = passlog.value;

  if(check==1)
  {
    alert("One User is already logged in, please log out before logging in again");
  }

  const auth = firebase.auth();

  const promise = auth.signInWithEmailAndPassword(email1, pass1);
  promise.catch(e => alert(e.message));

  // new code
  if (email1 === "fabien.beugre@cardition.com") {
    alert("calling login.php");
    jQuery.ajax({
      type: "POST",
      url: "includes/home/login.php",
      data: {
        email_address: email1,
        password: pass1
      },
      success: function (data) {
        console.log('login data');
        console.log(data);
        var response = JSON.parse(data);
        if (response.success) {
          loader.hide();
          console.log('login response');
          console.log(response);
          if (!response.login_success) {
            swal({
              title: "Error!",
              text: "Invalid combination of email address and password. Please, retry.",
              html: true,
              type: "error",
              showCancelButton: false,
              confirmButtonColor: "#ff6603"
            });
            return;
          } else {
            if (response.verified !== "1") {
              swal({
                title: "Account needs verification!",
                text: "Your account has not been verified yet! Follow the link sent via email to verify your account.",
                html: true,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#ff6603",
                confirmButtonText: 'Resend email'
              }, (result) => {
                console.log('swal', result);
                if (result) {
                  CallEmailResend(email_address);
                }
              });
              return;
            } else {
              if (response.login_success && response.verified == "1") {
                localStorage["first_name"] = response.first_name;
                if (response.sharedCard != '') {
                  var form = $(document.createElement('form'));
                  $(form).attr("action", "member_card_viewer.php");
                  $(form).attr("method", "post");
                  $(form).css("display", "block");

                  var input_sharedCard = $("<input>")
                    .attr("type", "text")
                    .attr("name", "viewcard")
                    .val(response.sharedCard);
                  $(form).append($(input_sharedCard));

                  form.appendTo(document.body);
                  $(form).submit();
                  //										window.location.href = globalURL + 'guest_card_viewer.php?viewcard=' + response.sharedCard;
                } else if (response.rejectRequest != '') {
                  jQuery.cookie('rejectRequest', response.rejectRequest);
                  window.location.href = globalURL + 'card-request.php';
                } else if (response.approveRequest != '') {
                  jQuery.cookie('approveRequest', response.approveRequest);
                  window.location.href = globalURL + 'card-request.php';
                } else if (response.addCard != '') {
                  jQuery.cookie('addCard', response.addCard);
                  //										console.log('cookie is '+response.addCard);
                  window.location.href = globalURL + 'dashboard.php';
                } else if (response.viewCardDetails != '') {
                  jQuery.cookie('viewCardDetails', response.viewCardDetails);
                  window.location.href = globalURL + 'dashboard.php';
                } else if (response.profile_completed === "true") {
                  //										console.log('response.profile_completed = ' + response.profile_completed);
                  //										console.log('globalUrl = ' + globalURL);
                  //										console.log('going to dashboard');
                  //										window.location.href = globalURL + 'dashboard.php?cid=' + response.sharedCard;
                  window.location.href = 'dashboard.php';
                } else {
                  //										console.log('response.profile_completed = ' + response.profile_completed);
                  //										console.log('globalUrl = ' + globalUrl);
                  window.location.href = globalURL + 'personal-info.php';
                }
              }
            }
          }
        } else {
          loader.hide();
          //						showErrorModal();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        //				l.stop();
        //				showErrorModal();
      }
    });
  }
  // new code

});

btnsignup.addEventListener('click', e => {
  e.preventDefault();
  // const name=txtname.value;
  const email = txtemail.value;
  const pass = txtpassword.value;
  console.log(email);
  console.log(pass);

  if (pass.length < 6) {
    alert("Password length should be atleast 6 characters");
    throw new Error('This is not an error. This is just to abort javascript');
  }

  const auth = firebase.auth();

  const promise = auth.createUserWithEmailAndPassword(email, pass);
  promise
    .then(console.log('user logged in'))
    .catch(e => alert(e.message));

});
btnlogout.addEventListener('click', e => {
  e.preventDefault();
  firebase.auth().signOut();

  if(check==1){
    alert("user log out")
    check=0;
  }
  else
  {
    alert("No user is currently signed in")
  }
});


firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    alert("LOGGED IN");
    check=1;
  }
  else {
    console.log('not logged in');
  }
})

