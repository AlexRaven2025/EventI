import './events.css'
export const Events = () => {
    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-cover'>
                    <div className='local-Events-top-cover'>
                        <h1>Events</h1>
                    </div>
                    <div className='local-Event-decription'>
                        <h1>Event Description</h1>
                    </div>
                    <div className='local-event-calender'>
                        
                    </div>

                </div>
            </div>


            <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
            </footer>
        </div>
    )
}
export default Events;