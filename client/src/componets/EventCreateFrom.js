import './EventCreateForm.css';

export const EventCreateFrom = () => {
        return (
            <div className='EventCreateForm-container'>
                <div className='CreateEventForm'>
                    <div class="mb-3">
                      <label for="event_name" class="form-label">Enter Event Name</label>
                      <textarea class="form-control" name="event_name" id="event_name" rows="3"></textarea>
                    </div>
                </div>
                
            </div>
        );
    }

export default EventCreateFrom;