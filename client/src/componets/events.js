import './events.css'
import Card from 'react-bootstrap/Card';
export const Events = () => {
    return (
        <div className='main-container'>
            <div className='table-events-container'>
                <div className='top-cover'>
                    <div className='local-Events-top-cover'>
                        <h1>Events</h1>
                    </div>
                    <div className='local-Event-decription'>
                        <h1>Event Description</h1>
                        <div className='Event-cards'>
                            <Card style={{ width: '23em'}}>
                              <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                  Some quick example text to build on the card title and make up the
                                  bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                              </Card.Body>
                            </Card>
                        </div>

                        
                    </div>
                    <div className='local-event-calender'>
                        
                    </div>

                </div>
            </div>


            <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
            </footer>
        </div>
    );
}
export default Events;