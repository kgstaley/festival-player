import { Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Album } from '../../type-defs';

const _Album = (props: Album) => {
    const theme = useTheme();
    const { palette } = theme;
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        if (!!props.images && props.images.length > 0) {
            setAvatar(props.images[0].url);
        }
    }, [props]);

    // main render
    return (
        <React.Fragment>
            <div className="avatar-container">
                <img key={avatar} className="avatar" src={avatar} alt={props.name} />
            </div>
            <div className="flex flex-col" style={{ justifyContent: 'flex-end', textAlign: 'end' }}>
                <Typography
                    variant="h4"
                    component="h4"
                    style={{ color: palette.info.light, fontFamily: 'monospace', paddingBottom: '0.5rem' }}
                >
                    {props.name}
                </Typography>
                <div
                    className="flex flex-col"
                    style={{
                        fontWeight: 300,
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: palette.info.light,
                        justifyContent: 'flex-end',
                        textAlign: 'end',
                    }}
                >
                    <div>Type: {props?.type}</div>
                    <div>Tracks: {props?.total_tracks?.toString()}</div>
                    <div>Release Date: {moment(props.release_date).format('DD MMM YYYY')}</div>
                </div>
            </div>
        </React.Fragment>
    );
};

export const AblumItem = React.memo(_Album);
