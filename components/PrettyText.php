<?php
namespace pistol88\task\components;

/**
 * PrettyComment
 *
 * �������� �� html ���� ��������� ������ �� ���-�������� � ��������. �������� ���.
 *
 * 
 */

class PrettyText extends \yii\base\Component {

	private $text;
	private $nomat = array('���', '����', '����', '����', '����', '����', '����', '����', '����', '�����', '�����', '���', '����', '����', '����', '����', '����', '���', '����', '����', '���', '�����', '����', '������', '�����', '������', '������', '����', '����', '���', '����', '���', '���', '����', '����', '�����', '����', '����', '����', '����');
	private $images_hosts = array('vk.me/u');
	private $smiles = array(
					':)' => '/assets/images/smiles/smile.gif',
					':(' => '/assets/images/smiles/unsmile.gif',
					';)' => '/assets/images/smiles/ye.gif',
					':D' => '/assets/images/smiles/d.gif'
				);
    /**
     * �������� ���.
     *
     */
	function mat() {
		$text = $this->getText();

		$bad_word = array("/��(�|�|�|�|�(�|�|�))/si","/��(�|�)(�|�)/si","/���/si","/���(�|�|�)/si","/(�|��)��(�|�|�)/si","/(:|_|-|��|)��(�|��|��|�|�|��|���)/si","/��(�)/si","/���/si","/����/si","/��(�|�)(�|�|�|�)/si","/���(�|�)/si","/�(�|�)�(�|�)�/si","/���/si","/�(�|�)����/si","/�����/si","/(�|�)�(�|�|�)/si","/(�|�)�(�|�)/si","/(�)�/si","/(�������|������|�����|������|������|���|���|���)/si","/�(�|�)�(�|�|�|��|��)/si","/���(��|�|�)/si","/�(�|�)�(��)/si");

		$arr = explode(" ", $text);
		if(is_array($arr) AND isset($bad_word)) { 
			foreach ($arr AS $v) {
				$break = false;
				foreach($this->nomat as $nomat) {
					if(substr_count(mb_strtolower($v), $nomat)) {
						$val[] = $v;
						$break = true;
					}
				}
				if(!$break) {
					$error = 0;
					for($i=0;$i<count($bad_word);$i++) {
						if(preg_match($bad_word[$i],mb_strtolower($v))) $error++;
					}
					if($error>0) $val[] = preg_replace($bad_word, "***", mb_strtolower($v)); 
					else $val[] = $v;
				}
			}
			
			$this->setText(implode(" ", $val));
		} 
		
		return $this;		
	} 
				
    /**
     * ������������� �����, � ������� ����� ��������.
     *
     * @param string $text
     * @return object
     */
	public function setText($text) {
		$this->text = $text;
		return $this;
	}
    /**
     * ���������� �����, � ������� ����� ��������.
     *
     * @return string
     */
	public function getText() {
		return trim($this->text);
	}
    /**
     * ����������� ���� ������� � html ��������
     *
     * @return object
     */
	public function smiles($smiles = null) {
		if(empty($smiles)) {
			$smiles = $this->smiles;
		}
		$text = $this->getText();
		foreach($smiles as $code => $img) {
			$text = str_ireplace(" $code", " <img src=\"$img\" alt=\"$code\" title=\"$code\" class=\"pretty_smile\" /> ", $text);
		}
		$this->setText($text);
		return $this;
	}
    /**
     * ����������� ��������� ������ � html ��� a
     *
     * @return object
     */
	public function links() {
		$preg_autolinks = array(
			'pattern' => array(
				"'(https?://[A-z0-9\.\?\+\-/_=&%#:;]+[\w/=]+)'si",
				"'([^/])(www\.[A-z0-9\.\?\+\-/_=&%#:;]+[\w/=]+)'si",
			),
			'replacement' => array(
				'<a href="$1" target="_blank" rel="nofollow">$1</a>',
				'$1<a href="http://$2" target="_blank" rel="nofollow">$2</a>',
			));
		$text = $this->getText();
		$text = preg_replace($preg_autolinks['pattern'], $preg_autolinks['replacement'], $text);
		$this->setText($text);
		return $this;
	}
    /**
     * ����������� ��������� ������ �� ��������
	 * � html ��� img
     *
	 * @param array $hosts ������ ������
     * @return object
     */
	public function images($hosts = null) {
		if(empty($hosts)) {
			$hosts = $this->images_hosts;
		}
		if(!$hosts) return $this;
		$pattern = "'http://[A-z0-9\.\?\+\-/_=&%#:;]+[\w/=]+'si";
		preg_match_all($pattern, $this->text, $links);
		$text = $this->getText();
		foreach($links[0] as $link) {
			foreach($hosts as $host) {
				if(substr_count($link, $host)) {
					$text = str_replace("$link", "<div class=\"pretty_image\"><img src=\"$link\" /></div>", $text);
					break;
				}
			}
			
		}
		$this->setText($text);
		return $this;
	}
}