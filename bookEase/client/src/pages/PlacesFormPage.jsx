import { useEffect, useState } from 'react';
import PhotosUploader from '../PhotosUploader';
import Perks from '../Perks';
import axios from 'axios';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';


const PlacesFormPage = () => {
    const {id} = useParams();
    console.log(id);

    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const [redirect,setRedirect] = useState(false);

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/places/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        })
    },[id])

    function inputHeader(text){
        return (
            <h2 className='text-2xl mt-4'>{text}</h2>
        )
    }
    function inputDescription(text){
        return (
            <p className='text-gray-500 text-sm'>{text}</p>
        )
    }
    function preInput(header,description){
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev){
        ev.preventDefault();
        const placeData = {title,address,addedPhotos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price}
        if(id){
            // update
            await axios.put('/places', {
                id, ...placeData
            })
            setRedirect(true);

        }
        else{
            // Add new Place
            await axios.post('/places', placeData);
            setRedirect(true);
        }
        
    }

    if(redirect){
        return <Navigate to={'/account/places'} />
    }

  return (
    <div className=''>
            <AccountNav />
                <form onSubmit={savePlace}>
                    {preInput('Title','title for your place, should be short and catchy.')}
                    <input type="text" 
                    value={title} 
                    onChange={ev => setTitle(ev.target.value)} 
                    placeholder='title, for example: My lovely apt' />

                    {preInput('Address','Address to this place.')}
                    <input type="text" 
                    value={address} 
                    onChange={ev => setAddress(ev.target.value)} 
                    placeholder='address' />

                    {preInput('Photos','More = Better.')}
                    <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>

                    {preInput('Description','Add a description about your place.')}
                    <textarea value={description} onChange={ev=> setDescription(ev.target.value)} className=''></textarea>

                    {preInput('Perks','Select all the perks of your place.')}
                    <Perks selected={perks} onChange={setPerks}/>

                    {preInput('Extra Info','house rules, etc')}
                    <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} ></textarea>

                    {preInput('Check in&out time','add check in and out time.')}
                    <div className='grid gap-1 grid-cols-2 md:grid-cols-4'>
                        <div>
                            <h3 className='mt-2 -mb-1'>Check-In time</h3>
                            <input value={checkIn} 
                            onChange={ev => setCheckIn(ev.target.value)} 
                            type="text" placeholder='14'/>
                        </div>
                        <div>
                            <h3 className='mt-2 -mb-1'>Check-Out time</h3>
                            <input value={checkOut} 
                            onChange={ev => setCheckOut(ev.target.value)} 
                            type="text" placeholder='11'/>
                        </div>
                        <div>
                            <h3 className='mt-2 -mb-1'>Max-Guests</h3>
                            <input value = {maxGuests} 
                            onChange={ev => setMaxGuests(ev.target.value)} 
                            type="number"/>
                        </div>
                        <div>
                            <h3 className='mt-2 -mb-1'>Price per night</h3>
                            <input value = {price} 
                            onChange={ev => setPrice(ev.target.value)} 
                            type="number"/>
                        </div>

                    </div>

                    <div>
                        <button className='primary my-4' type='submit'>Save</button>
                    </div>

                </form>
            </div>
  )
}

export default PlacesFormPage