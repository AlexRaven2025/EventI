import './profile.css'
import Button from 'react-bootstrap/Button';
export const Profil = () => {
    return(
            <div className='profile-container'>
                <div className='profile-image'>
                    <picture>
                        <source srcset="https://placehold.co/200x200" type="image/svg+xml"/>
                        <img src="image source" class="img-fluid" alt="desc"/>
                      </picture>
                </div>
                <div className='dash-links'>
                    <Button variant="primary" size="lg" active>
                    Your Events
                    </Button>{' '}
                    <Button variant="secondary" size="lg" active>
                    Add Events
                    </Button>
                </div>
            </div>
    );
}
export default Profil;