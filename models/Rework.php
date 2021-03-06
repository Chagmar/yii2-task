<?php

namespace pistol88\task\models;

use Yii;

/**
 * This is the model class for table "task_rework".
 *
 * @property integer $id
 * @property string $text
 * @property string $date_start
 * @property string $date_deadline
 * @property integer $task_id
 * @property integer $perfomer_id
 * @property string $status
 * @property string $price
 * @property integer $number
 * @property string $payment
 * @property string $payment_perfomer
 * @property string $comment
 */
class Rework extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'task_rework';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['text', 'date_start', 'task_id', 'perfomer_id', 'number'], 'required'],
            [['text', 'status', 'payment', 'payment_perfomer', 'comment'], 'string'],
            [['date_start', 'date_deadline'], 'safe'],
            [['task_id', 'perfomer_id', 'number'], 'integer'],
            [['price'], 'number'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'text' => 'Текст',
            'date_start' => 'Дата',
            'date_deadline' => 'Дедлайн',
            'task_id' => 'Задача',
            'perfomer_id' => 'Исполнитель',
            'status' => 'Статус',
            'price' => 'Стоимость',
            'number' => 'Порядковый номер',
            'payment' => 'Оплачено',
            'payment_perfomer' => 'Оплачено исполнителю',
            'comment' => 'Комментарий',
        ];
    }
    
    public function getTask()
    {
        return $this->hasOne(Task::className(), ['id' => 'task_id']);
    }
    
    public function getPerfomer()
    {
        return $this->hasOne('pistol88\staffer\models\Staffer', ['id' => 'perfomer_id']);
    }
    
    public function getMembers()
    {
        if($this->task) {
            return $this->task->members;
        }
        
        return [];
    }
    
    public function beforeSave($insert)
    {
        parent::beforeSave($insert);
        
        if(!$this->date_start) {
            $this->date_start = date('Y-m-d H:i:s');
        }
        
        return true;
    }
    
    public function getPayment_type_id()
    {
        return 0;
    }
    
    public function getCost()
    {
        return $this->price;
    }

    public function getEndprice()
    {
        return ($this->price*2);
    }
}
