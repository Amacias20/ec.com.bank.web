
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React from 'react';

const Home: React.FC = () => {

    const apps = [
        { name: 'Aduanas', description: 'Gestión de aduanas', icon: 'pi pi-globe' },
        { name: 'Contabilidad y Finanzas', description: 'Control financiero y contable', icon: 'pi pi-dollar' },
        { name: 'Seguridad', description: 'Seguridad empresarial', icon: 'pi pi-lock' }
    ];

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <div className="flex flex-wrap justify-content-end gap-2">
            <Button label="Ir" icon="pi pi-arrow-right" />
        </div>
    );
    return (
        <div>
            <div className=" flex justify-content-center mt-5">
                {apps.map((value) => {
                    return (<Card title={value.name} footer={footer} header={header} className="md:w-25rem ml-4 mr-4">
                        <p className="m-0">
                            {value.description}
                        </p>
                    </Card>)
                })}

            </div>
        </div>


    )



};

export default Home;