import { useContext } from 'react'
import MainContext from '../../contexts/MainContext'

export default function ProgressIndicator() {
    const { inProgress } = useContext(MainContext);
    const inProgressText = ['Ready', 'Loading heightmaps...', 'Updating...'];

    const className = 'progress-indicator ' + (inProgress ? 'in-progress' : 'ready'); 

    return (
        <div className={className}>
            {inProgressText[inProgress]}
        </div>
    );
}