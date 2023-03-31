import React, { Component } from 'react';
import { Timeline } from '@xzdarcy/react-timeline-editor' ; 
import { TimelineEffect, TimelineRow } from '@xzdarcy/react-timeline-editor';
import styles from './analyticsbar.module.css';

interface AnalyticsProps {
  vidData: any
  labels: any;
  videoTiming: any;
}


export default class AnalyticsBar extends React.Component<AnalyticsProps> {
  private domRef?: React.LegacyRef<HTMLDivElement>;
  private labelArray: string[];
  private dataset: TimelineRow[];

  constructor(props: AnalyticsProps) {
    super(props);

    this.domRef = React.createRef();
    this.dataset = [];
    this.labelArray = Object.keys(this.props.labels);

    this.handleTimeChange = this.handleTimeChange.bind(this);

    // {frame: [unique labels that appear in that frame]}
    const frameAnalytics: any = {}
    for (let [key, value] of Object.entries(this.props.vidData)) {
      frameAnalytics[key] = (value as any).map((item: any) => {
        return item.tag.name;
      }).filter((item: any, index: any, array: any) => {
        return array.indexOf(item) === index; 
      })
    }

    // {tag: [frames that contain that label]}
    const tagAnalytics: any = {}
    if (this.labelArray) {
      this.labelArray.forEach((item: any) => {
        for (let [key, value] of Object.entries(frameAnalytics)) {
          if ((value as any).includes(item)) {
            tagAnalytics[item] = tagAnalytics[item] ? tagAnalytics[item] : []
            tagAnalytics[item].push(key)
          }
        }
      })
    }

    // {tag: [{id: label name, start: time that label appear, end: time that label ends, effectId: 'effect0'}]
    this.dataset = this.labelArray.map((item: any) => {
      return {
        id: item,
        actions: tagAnalytics[item] ? tagAnalytics[item].map((subItem: any, idx:number) => {
          return {
            id: `item-${idx}`,
            start: Number(subItem) / 1040,
            end: (Number(subItem) + 40) / 1040,
            effectId: "effect0", // not sure what is this
          }
        }) : []
      };
    } 
    );
  }


  // not sure what is this
  private mockEffect: Record<string, TimelineEffect> = {
    effect0: {
      id: "effect0",
      name: "effect0",
    },
  };

  handleTimeChange = (time: number) => {
    this.props.videoTiming(time) // pass the time to the parent component
  }




  public render() {
    return (
      <div style={{ width: '100%' }}>
        <div className={styles['Timeline-editor-example7']}>
          <div
            ref={this.domRef}
            style={{ overflow: 'overlay' }}
            className={styles['timeline-list']}
          >
            {this.dataset.map((item, idx) => {
              // creates a vertical list of labels corresponding to the timeline
              return (
                <div className={styles["timeline-list-item"]} key={item.id}>
                  <div className={styles["text"]}>{`${item.id}`}</div> 
                </div>
              );
            })}
          </div>
          <Timeline 
            editorData={this.dataset}
            effects={this.mockEffect}
            disableDrag={true}
            style={{ width: '100%' }}
            scale={1}
            onClickAction={(action, time) => {
              this.handleTimeChange(time.time);
            }}
          />
        </div>
      </div>
    );
  }
}
