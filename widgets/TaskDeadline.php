<?php
namespace pistol88\task\widgets;

use yii\helpers\Html;
use yii\data\ActiveDataProvider;
use yii;

class TaskDeadline extends \yii\base\Widget
{
    public $task = null;

    public function init()
    {
        \pistol88\task\assets\AjaxWidgets::register($this->getView());

        return parent::init();
    }

    public function run()
    {
        return $this->render('task_deadline', [
            'model' => $this->task,
        ]);
    }
}
