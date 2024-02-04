import { useState, useEffect, useRef, Fragment } from 'react';
import classes from './contact-form.module.css';
import Notification from '../ui/notification';

async function sendContactData(enteredData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(enteredData),
    headers: {
      'Content-Type': 'Application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

function ContactForm() {
  const enteredEmailRef = useRef();
  const enteredNameRef = useRef();
  const enteredMessageRef = useRef();

  const [showNotification, setShowNotification] = useState(false);
  const [notiTitle, setNotiTitle] = useState();
  const [notiMessage, setNotiMessage] = useState();
  const [notiStatus, setNotiStatus] = useState();

  function notificationHandler({ show, title, message, status }) {
    setShowNotification(show);
    setNotiTitle(title);
    setNotiMessage(message);
    setNotiStatus(status);
  }

  useEffect(() => {
    if (notiStatus === 'error' || notiStatus === 'success') {
      const timer = setTimeout(() => {
        setShowNotification(false);
        enteredEmailRef.current.value = '';
        enteredNameRef.current.value = '';
        enteredMessageRef.current.value = '';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notiStatus]);

  async function sendMessageHandler(e) {
    e.preventDefault();

    notificationHandler({
      show: true,
      title: 'Pendding',
      message: 'Sending Data to server...',
    });

    const enteredData = {
      email: enteredEmailRef.current.value,
      name: enteredNameRef.current.value,
      message: enteredMessageRef.current.value,
    };

    try {
      const data = await sendContactData(enteredData);
      notificationHandler({
        show: true,
        title: 'Succeed!',
        message: data.message,
        status: 'success',
      });
      console.log(data);
    } catch (error) {
      notificationHandler({
        show: true,
        title: 'Failed!',
        message: error.message,
        status: 'error',
      });
    }
  }

  return (
    <Fragment>
      <section className={classes.contact}>
        <h1>How can I help you?</h1>
        <form className={classes.form} onSubmit={sendMessageHandler}>
          <div className={classes.controls}>
            <div className={classes.control}>
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                ref={enteredEmailRef}
                autoComplete="email"
                required
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                ref={enteredNameRef}
                autoComplete="name"
                required
              />
            </div>
          </div>
          <div className={classes.controm}>
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              rows={5}
              ref={enteredMessageRef}
              autoComplete="off"
            />
          </div>
          <div className={classes.actions}>
            <button>Send Message</button>
          </div>
        </form>
      </section>
      {showNotification && (
        <Notification
          title={notiTitle}
          message={notiMessage}
          status={notiStatus}
        />
      )}
    </Fragment>
  );
}

export default ContactForm;
